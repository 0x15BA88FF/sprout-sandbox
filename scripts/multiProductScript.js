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
const arrayOfColors = generateArrayOfColors(2);
console.log(arrayOfColors);

let getProductData = async () => {
  try {
    //FETCHING DATA
    let response = await fetch(`http://localhost:3000/getAllProducts/all`);
    let result = await response.json();
    // Extracting data from the result
    // Product names as labels
    const productIds = result.map(item=>{`${item}`});
    console.log(productIds)
    const dataValues = result.map(); // Total sales as data values
     //
    const data = {
      //PASSING DATA INTO CHART ELEMENT
      labels:productIds,
      datasets:[
        {
          label: 'Product Overall Performance',
          data:[14,34,42,46,56]/*dataValues*/,//GET from DB
          //AESTHETICS // 
          backgroundColor:["rgba(255,0,0,0.5)","rgba(0,255,0,0.5)"],
          hoverOffset:4,
          borderColor: '#262626',
          borderRadius:5,
          borderWidth:2,
          
        }
      ]
    };
 //CONFIG WHICH WILL BE PASSED TO new Chart OBJ
    const config = {
      type: 'bar',
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
  
