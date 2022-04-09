import React from "react";
import AntdExample from "./AntdExample";
import CountryChart from "./CountryChart";
import {Container, Row, Col} from 'reactstrap';
import Custome from "./CustomeTable/Custome";

function index() {
  return (
    <Container>
        <div className='container text-center'>
          <CountryChart />
          <br/>  <br/>
          <h1>User list</h1>
          <p className="header-description">Antd library Example Using Class Component</p>
          <AntdExample />
       
          <Custome />
        </div>
    </Container>
  );
}

export default index;