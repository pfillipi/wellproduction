import { ApexOptions } from "apexcharts";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)

interface IData {
  date: string;
  error: number;
  value: number
}

interface IChart {
  name: string;
  data: number[];
  type: string
}

function App() {
  const getData = async () => {
    const response = await axios.get("http://localhost:8080/data")
    const currentValue = response.data.map((item: IData) => [item.date, item.value])
    const errorFormatted = response.data.map((item: IData) => [item.date, item.error])
    return {
      currentValue, errorFormatted
    }
  }

  const setData = useCallback(async () => {
    const { currentValue, errorFormatted } = await getData();
    setGrowingSeries([{
      name: 'Water Production',
      data: currentValue,
      type: 'line'
    }])
    setErrorSeries([{
      name: 'error',
      data: errorFormatted,
      type: 'bar'
    }])
  }, [])

  useEffect(() => {
    setData()
  }, [setData])

  const [
    growingOptions, setGrowingOptions
  ] = useState<ApexOptions>({
    chart: {
      id: "growing",
      group: "rate"
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Sm³/d',
        style: {
          color: '#36577b'
        },
      },
      decimalsInFloat: 0,
    },
    colors: ['#ffa500']
  });
  const [
    growingSeries, setGrowingSeries
  ] = useState<IChart[]>([]);
  const [
    errorOptions, setErrorOptions
  ] = useState<ApexOptions>({
    chart: {
      id: "basic-bar",
      group: "rate",
    },
    xaxis: {
      type: 'datetime',

    },
    yaxis: {
      decimalsInFloat: 0,
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#ff0000'],
  });
  const [
    errorSeries, setErrorSeries
  ] = useState<IChart[]>([]);

  return (
    <>
      <div className="container">
        <header>
          <div className="left">
            <h1>Water Production - Rate</h1>
            <h2>Poor - Coverage 0.2</h2>
          </div>
          <div className="right">
            <h1>Well Name</h1>
          </div>
        </header>
        <div>
          <div className="box">
            <div className="box-header">
              <div>
                <p>(Prediction interval) <span>Ensemble</span></p>
                <ul className="interval">
                  <li className="item1">
                    <div></div><span>95%</span>
                  </li>
                  <li className="item2">
                    <div></div><span>50%</span>
                  </li>
                  <li className="item3">
                    <div></div><span>10%</span>
                  </li>
                </ul>
              </div>
              <div className="box-separator">
              </div>
              <div className="box-data">
                <div className="box-confidence">
                  <p>Observed data</p>
                  <span></span>
                  <strong>95 % confidence interval</strong>
                </div>
                <div className="box-mean">
                  <div className="line"></div>
                  <strong>Mean value</strong>
                </div>
              </div>
            </div>
            <DynamicComponentWithNoSSR
              options={growingOptions}
              series={growingSeries}
              type="scatter"
              height="450"
            />

          </div>
          <div className="box">
            <DynamicComponentWithNoSSR
              options={errorOptions}
              series={errorSeries}
              type="bar"
              height="200"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
