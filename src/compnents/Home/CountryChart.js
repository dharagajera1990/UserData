import React, { useState, useEffect } from "react";
import { ResponsiveContainer,PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from "axios";
import { Table, Tag, Space } from 'antd';
import "./style.css";
import 'antd/dist/antd.css';

export default function CountryChart() {
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(1);
  const fetchPost = async () => {
  const response = await axios("https://randomuser.me/api/?results=25&inc=id,name,location,registered,phone,picture");
      var test =[];
      response.data.results.map((val)=>{
         test.push({
          id:val.id.value,
          name:val.name.title+" "+val.name.first +" "+val.name.last,
          location:val.location.city,
          registered: new Date(val.registered.date).toISOString().slice(0, 10),//val.registered.date,
          phone:val.phone,
          picture:val.picture.thumbnail,
          country:val.location.country
         });
      });

      var output = Object.values(test.reduce((obj, { country }) => {
       if (obj[country] === undefined)
          obj[country] = { country: country, occurrences: 1 };
       else
          obj[country].occurrences++;
       return obj;
    }, {})).sort((a,b) => b.occurrences - a.occurrences );;

     console.log("main",output);

      var arr2 =[];
      var sumofPopular = 0;
      for(let i=0; i<output.length; i++){
         const counter = {};
          if(i<4){
            counter['country'] = output[i].country;
            counter['value'] =  parseFloat((output[i].occurrences/25 * 100).toFixed(1));
            arr2.push(counter);
            sumofPopular += (output[i].occurrences/25 * 100);
          }else{
            counter['country'] = 'other';
            counter['value'] =  parseFloat((100 - sumofPopular).toFixed(1));
            arr2.push(counter);
            break;
          }
      }
          
      console.log(arr2);
      setPosts(arr2);
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const COLORS = ['#f64545', '#00C49F', '#FFBB28', '#FF8042','#4A9EE7'];

  const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                    <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
                </div>
            );
        }

        return null;
    };

   return (
    <div className="App">
    <h1>Users Chart</h1>
    {posts &&
        <div style={{ width: "100%", height: 600 }}>
          <ResponsiveContainer>
            <PieChart width={730} height={400}>
                <Pie data={posts} color="#000000" label={({cx,cy,midAngle,innerRadius,outerRadius,value,index}) => {
                        const RADIAN = Math.PI / 180;
                        // eslint-disable-next-line
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        // eslint-disable-next-line
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        // eslint-disable-next-line
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <>
                            <text x={x} y={y-20} fill="#fff" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                              {posts[index].country} 
                            </text>
                            <text x={x+10} y={y} fill="#9a9ea2" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">{value} %</text>
                          </>
                        );
                      }} dataKey="value" nameKey="country" cx="50%" cy="50%" outerRadius="70%" fill="#8884d8" >
                    {
                        posts.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)
                    }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
    }
    </div>
  );
}


