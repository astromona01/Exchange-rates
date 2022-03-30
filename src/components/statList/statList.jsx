import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark } from '@fortawesome/free-solid-svg-icons'

export const StatList = (props) => {
		const { Currency, statList, showStatList, setShowStatus, setStatList } = props
		const closeList = () => {
				setShowStatus(false);
				setStatList([]);
		}
		return (
				<div className={`${showStatList ? "visible-list" : ''} statistic-list`}>
						<div className="stat-list-head">
								{Currency[0]}
								<FontAwesomeIcon icon={faXmark} onClick={closeList}/>
						</div>
						<div className="stat-list-head">{ Currency[1] }</div>
						{
								statList.map((el) => <div className="stat-list-item" key={`${el.rublesValue}-${el.percentage}`}>
										<div>{ el.Date }</div>
										<div>{ el.rublesValue.toFixed(4) }</div>
										<div>{ el.percentage.toFixed(2) }%</div>
								</div>)
						}
				</div>
		)
}