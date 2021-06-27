



const MyChart = ({label, title, Component, data, bgColor, brdrColor}) => {

    const state = {
        labels: ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: bgColor || 'rgba(6, 95, 70, 1)',
            borderColor: brdrColor || 'rgba(6, 95, 70, 1)',
            borderWidth: 1,
            data: data
          }
        ]
      }

    return <div className="p-10 md:w-4/5 border border-gray-900 md:m-auto mb-24 md:mb-10">
            <h1 className="text-center text-green-800">{title}</h1>
            <Component
                data={state}
                options= {{}}
            />
    </div>


}


export default MyChart;