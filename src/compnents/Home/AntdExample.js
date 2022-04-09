import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import "./style.css";
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class AntdExample extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        searchText: '',
        searchedColumn: '',
        post:[]
      };
  }
  
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  componentDidMount() {
    // /&nat=us,fr,gb,CA,BR to get specific country data
   fetch("https://randomuser.me/api/?results=15&inc=id,name,location,registered,phone,picture")
      .then(res => res.json())
      .then(
        (result) => {
          var test =[];
          
            result.results.map((val)=>{
               test.push({
                id:val.id.value,
                name:val.name.title+" "+val.name.first +" "+val.name.last,
                location:val.location.city+","+val.location.country,
                registered: new Date(val.registered.date).toISOString().slice(0, 10),//val.registered.date,
                phone:val.phone,
                picture:val.picture.thumbnail,
                country:val.location.country
               });

            });

            this.setState({post:test});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
    )
  }

  render() {

    const handleRemoveSpecificRow = item => () => {
      let items = this.state.post.filter(row => row.id != item);
      this.setState({post:items});
    };

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        ...this.getColumnSearchProps('location'),
        sorter: (a, b) => a.location.length - b.location.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Registered',
        dataIndex: 'registered',
        key: 'registered',
         ...this.getColumnSearchProps('registered'),
         sorter: (a, b) => new Date(a.registered) - new Date(b.registered),
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        ...this.getColumnSearchProps('phone')
      },
      {
            title: "Picture",
            dataIndex: "picture",  // this is the value that is parsed from the DB / server side
            render: picture => <img alt={picture} src={picture} />  // 'theImageURL' is the variable you must declare in order the render the URL
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={handleRemoveSpecificRow(record.id)}>Delete</a>
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={this.state.post} scroll={{ x: true }} />;
  }
}
export default AntdExample;