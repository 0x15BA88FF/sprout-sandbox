const ctx = document.getElementById('demandChart').getContext('2d');
function generateRandomColor() {
  // Generate random values for red, green, blue, and alpha channels
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random().toFixed(2); // Random alpha value between 0 and 1

  // Construct the RGBA color string
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
}
function generateArrayOfColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
      colors.push(generateRandomColor());
  }
  return colors;
}
// Generate an array of 7 RGBA colors
const arrayOfColors = generateArrayOfColors(7);
console.log(arrayOfColors);

let getProductData = async () => {
  try {
    //FETCHING DATA
    let id="ABC123"//this id should be from farmer products.id or smth;
    let productName;
    let response = await fetch(`http://localhost:3000/getProductData/${id}`);
    let result = await response.json();
    console.log(result);
    console.log()
    // Extracting data from the result
   const labels = result.map(item => `${item.date}`); // Product names as labels not date just for testing
    const dataValues = result.map(item => item.quantity); // Total sales as data values
     //
    const data = {
      //PASSING DATA INTO CHART ELEMENT//
      labels:[1,2,3,4,5,6,7],
      datasets:[
        {
          label: 'Sales QTY of Product within last 7 days',
          data:dataValues,//FROM DB
          //AESTHETICS // 
          backgroundColor:arrayOfColors, // Red with opacity
          borderColor:arrayOfColors,
          borderWidth: 1,
          borderRadius:5,
          tension:0.5,
        }
      ]
    };
 //CONFIG WHICH WILL BE PASSED TO new Chart OBJ
    const config = {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid:{display:false}
          },
          x: {
            grid:{display:false}
          }
        },
        
      }
    };
    //CHART OBJ 
    const myChart = new Chart(ctx, config);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

getProductData();

// const data = {
//     labels: [], //time frame  array.. datasets are parsed by timeframe
//     datasets: [
//       // {
//       //   label:[],
//       //   data: [], //QUANTITY PER DAY
//       //   fill: false,
//       //   borderColor: 'cyan',
//       //   backgroundColor:"red",
//       //   tension: 0.3,
//       // },

//     ],
//   };
  
