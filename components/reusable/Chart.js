const MyChart = ({label, title, Component, data, bgColor, brdrColor, hoverColor}) => {

    const state = {
        labels: ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: bgColor || 'rgb(29, 29, 29)',
            borderColor: brdrColor || 'rgb(29, 29, 29)',
            hoverBackgroundColor: hoverColor || 'rgb(29, 29, 29)',
            borderWidth: 1,
            data: data
          }
        ]
      }

    return <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
            <Component
                data={state}
                options= {{}}
            />
    </div>


}


export default MyChart;