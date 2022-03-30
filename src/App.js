import './styles/App.css';
import { useState, useEffect } from "react";
import { CurrentData } from './components/currentData/currentData';
import { StatList } from "./components/statList/statList";

function App() {
  const [Api] = useState('https://www.cbr-xml-daily.ru/daily_json.js');
  let [prevApi, setPrevApi] = useState('');
  let [currentData, setCurrent] = useState({})
  let [statList, setStatList] = useState([])
  let [choosCurrency, setCurrency] = useState([]);
  let [date, setDate] = useState(null)
  let [showStatList, setShowStatus] = useState(false)

  useEffect(async () => {
    const data = (await getData(Api));
    setCurrent(data.data);
    setPrevApi(data.prevApi)
    setDate(data.date)
  }, [])

  const getData = async (api) => {
    try {
      const res = await fetch(api)
      const data = await res.json();
      const date = `${new Date(data.Date).getDate()} 
                    ${new Date(data.Date).toLocaleString('ru', { month: 'long' })}`;
      return {
        prevApi: data.PreviousURL,
        data: data.Valute,
        date,
      }
    }catch(e) {
      console.log(e)
    }
  }
  const getHandleData = (data) => {
    const content = []
    for (let key in data) {
      const item = data[key]
      const rublesValue = item.Value / item.Nominal
      const prevValue = item.Previous / item.Nominal
      const percentChange = (rublesValue - prevValue) / (prevValue / 100);
      content.push(
        <li key={item.CharCode} onClick={() => handleShowStatistic(item)} >
          <div onMouseOver={handleShowTooltip} onMouseOut={hideTooltip} className="mask"/>
          <div>{item.CharCode}</div>
          <div>{rublesValue.toFixed(4)}</div>
          <div>{ percentChange.toFixed(2) }%</div>
          <span className="tooltip">{item.Name}</span>
        </li>
      )
    }
    return content;
  }
  const handleShowStatistic = (item) => {
    let list = [];
    const calcValues = getCalculateValues(item)
    const { rublesValue, percentage, CharCode, Name } = calcValues;
    setShowStatus(true)
    setCurrency([CharCode, Name])
    list.push({ Date: date, rublesValue, percentage })
    fillStatList(prevApi, list, CharCode)
  }
  const getCalculateValues = (item) => {
    const { Nominal, Value, Previous, CharCode, Name } = item
    const rublesValue = Value / Nominal
    const prevValue = Previous / Nominal
    const percentage = (rublesValue - prevValue) / (prevValue / 100)
    return {
      rublesValue,
      percentage,
      CharCode,
      Name
    }
  }
  const fillStatList = async (api, list, CharCode) => {
    if (list.length >= 10){
      return setStatList(list)
    } else {
      const data = (await getData(api))
      const Date = data.date
      const item = data.data[CharCode]
      const calcValues = getCalculateValues(item)
      const { rublesValue, percentage } = calcValues;
      list.push({ Date, rublesValue, percentage })
      fillStatList(data.prevApi, list, CharCode)
    }
  }
  const handleShowTooltip = (e) => {
    const elem = e.target.parentNode
    const tooltip = elem.querySelector('.tooltip')
    const coords = getCoords(tooltip);
    const shiftX = e.pageX - coords.left;
    const shiftY = e.pageY - coords.top;
    elem.onmousemove = (ev) => showTooltip(ev, shiftX, shiftY, tooltip, coords)
    elem.onmouseleave = () => hideTooltip(e)
  }
  const hideTooltip = (e) => {
    const elem = e.target.parentNode
    const tooltip = elem.querySelector('.tooltip')
    tooltip.style.display = 'none';
  }
  const showTooltip = (e, shiftX, shiftY, tooltip, coords) => {
    const destin = e.pageY - shiftY
    tooltip.style.left = `${e.pageX + coords.width}px`
    tooltip.style.top = `${e.pageY - shiftY + (destin >= 0 ? 10 : 47)}px`
    tooltip.style.display = 'flex';
  }
  const getCoords = (elem) => {
    let box = elem.getBoundingClientRect();
    return {
      top: box.top ,
      left: box.left,
      width: box.width,
      height: box.height,
    };
  }
  return (
    <div className="App">
      <div className="container">
        <div className={`${showStatList ? "visible-mask" : ''} global-mask`} />
        <StatList Currency={choosCurrency} statList={statList} setStatList={setStatList}
                  showStatList={showStatList} setShowStatus={setShowStatus}
        />
        <CurrentData data={currentData} getHandle={getHandleData}/>
      </div>
    </div>
  );
}

export default App;
