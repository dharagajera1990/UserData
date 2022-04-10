import React, { useState, useEffect } from "react";
import { useTable, useFilters,  usePagination } from "react-table";
import axios from "axios";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {

    const count = preFilteredRows.length;

    return (
        <input
          className="form-control mainLoginInput"
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
          placeholder="&#61442;"
        />
    );
}
// Our table component
function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );
  const props = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {  pageSize: 20 },
    },
    useFilters,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = props;


  return (
    <>
        <div class="table-responsive">
            <table className="table " {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    {/* Render the columns filter UI */}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    
                                    if(cell.column.Header === 'Picture'){
                                        return <td {...cell.getCellProps()}><img src={cell.value} /></td>
                                    }
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function UserData() {
    const [posts, setPosts] = useState([]);
    const fetchPost = async () => {
    const response = await axios("https://randomuser.me/api/?results=100&inc=id,name,location,registered,phone,picture");
    var resData =[];
    response.data.results.map((val,key)=>{
        resData.push({
          id:val.id.value,
          uniqueId:key+1,
          name:val.name.title+" "+val.name.first +" "+val.name.last,
          location:val.location.city,
          registered: new Date(val.registered.date).toISOString().slice(0, 10),//val.registered.date,
          phone:val.phone,
          picture:val.picture.thumbnail
        });
    });
    setPosts(resData);
}
useEffect(() => {
    fetchPost();
}, []);
const columns = React.useMemo(
        () => [
            {
                Header: 'User List',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'name',
                    },
                    {
                        Header: 'Location',
                        accessor: 'location'
                    },
                    {
                        Header: 'Registered',
                        accessor: 'registered',
                    },
                    {
                        Header: 'Phone',
                        accessor: 'phone'
                    },
                    {
                        Header: 'Picture',
                        accessor: 'picture',
                        Filter: false,
                    },
                    {
                        Header: "Delete",
                        id: "delete",
                        Filter: false,
                        accessor: (str) => "delete",

                        Cell: (tableProps) => (
                          <span className="deleteBtn"
                            onClick={() => {
                                if (window.confirm("Do you really want Delete?")) {
                                  // ES6 Syntax use the rvalue if your data is an array.
                                  const dataCopy = [...posts];
                                  // It should not matter what you name tableProps. It made the most sense to me.
                                  dataCopy.splice(tableProps.row.index, 1);
                                  setPosts(dataCopy);
                                }
                            }}
                          >
                            Delete
                          </span>
                        )
                      }
                ],
            }
        ],[posts]
)

  return (
    <>
        <div className="react-table-example" >
            <Table columns={columns} data={posts} />
        </div>
    </>
  );
}

export default UserData;
