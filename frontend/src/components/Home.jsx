import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  let history = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleProceed = (id) => {
    history(`/edit_bill/${id}`);
  };

  const deleteHandler = async (id) => {
    try {
      axios.delete(`http://localhost:8080/api/bills/${id}`);
      enqueueSnackbar("Bill Deleted Successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
    window.location.reload();
  };

  useEffect(() => {
    const headers = {
      "access-control-allow-origin": "*",
      "Content-type": "application/json",
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:8080/api/bills",
          { headers }
        );
        if (response.length < 0) {
          enqueueSnackbar("No Data Found", { variant: "warning" });
        }
        setData(response);
      } catch (error) {
        enqueueSnackbar("Something went wrong", { variant: "error" });

        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [enqueueSnackbar]);
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5 home">
      <h2 className="text-white text-decoration-underline">
        <b>BILL DETAILS</b>
      </h2>
      <Table
        striped
        bordered
        hover
        variant="dark"
        size="sm"
        style={{ width: "90%" }}
        className="mt-5"
      >
        <thead>
          <tr>
            <th>Billing Date</th>
            <th>Amount</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        {data.length > 0 ? (
          data?.map((data) => (
            <tbody key={data.id}>
              <tr>
                <td>{data.billingDate}</td>
                <td>{data.amount}</td>
                <td>{formatDate(data?.createdAt)}</td>
                <td>{formatDate(data?.updatedAt)}</td>
                <td>
                  <Button
                    variant="outline-dark"
                    onClick={handleProceed.bind(this, data.id)}
                  >
                    <AiTwotoneEdit size="25px" style={{ color: "#b25837" }} />
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={deleteHandler.bind(this, data.id)}
                  >
                    <MdDelete size="25px" style={{ color: "#A52121" }} />
                  </Button>
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div>
            <h2 className="text-danger">No Data</h2>
          </div>
        )}
      </Table>
      {loading && <h2 className="text-white">Loading....</h2>}
      {!loading && error ? (
        <div>
          <h2 className="text-danger">Error while Fetching Data...</h2>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
