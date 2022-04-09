import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css'

import { Table } from './Table'

export default function Custome() {
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(1);
  const fetchPost = async () => {
  const response = await axios("https://randomuser.me/api/?results=25&inc=id,name,location,registered,phone,picture");
      var test =[];
      response.data.results.map((val,key)=>{
         test.push({
          id:key,
          name:val.name.title+" "+val.name.first +" "+val.name.last,
          location:val.location.city,
          registered: new Date(val.registered.date).toISOString().slice(0, 10),//val.registered.date,
          phone:val.phone,
          picture:val.picture.thumbnail
         });

      });
      setPosts(test);
  }

   const handleRemoveSpecificRow = item => () => {

    
    console.log("item",item)
    // const rows = [...rows];
    // rows.splice(index, 1);
    // setRows(rows);
    let items = posts.filter(row => row.id != item);
    setPosts(items);
  };
  useEffect(() => {
    fetchPost();
   }, []);





  const columns = [
    { accessor: 'name', label: 'Name' },
    { accessor: 'location', label: 'Location' },
    { accessor: 'registered', label: 'Registered' },
    { accessor: 'phone', label: 'Phone' },
    { accessor: 'picture', label: 'Picture',input:false,img:true,sort:false },
    { accessor: 'action', label: 'Action',input:false,sort:false, action:'delete'  },
  ]

  return (
    <div className="custome-wrapper">
      <h1>User List</h1>
      <p className="header-description">Using Custome hooks</p>
      <Table rows={posts} columns={columns} />
    </div>
  )
}
