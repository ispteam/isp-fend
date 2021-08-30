const MyChart = ({label, title, Component, data, bgColor, brdrColor, hoverColor}) => {

    const state = {
        labels: ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: bgColor || 'rgb(254, 52, 109)',
            borderColor: brdrColor || 'rgb(254, 52, 109)',
            hoverBackgroundColor: hoverColor || 'rgb(254, 52, 109)',
            borderWidth: 1,
            data: data
          }
        ]
      }

    return <div className="chart-container">
            <h1 className="chart-title">{title}</h1>
            <Component
                data={state}
                options= {{}}
            />
    </div>


}


export default MyChart;