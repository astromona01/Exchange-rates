
export const CurrentData = (props) => {
		const { data, getHandle } = props;
		return (
				<ul className="current-data">
						<div className="titles" >
								<span>Код валюты</span>
								<span>Значение в рублях</span>
								<span>Изменение</span>
						</div>
						{getHandle(data)}
				</ul>
		)
}