- As this Chart Library already have month selection I have used the way it is;
- To make the deployment possible I had added the JSON on GitHub, but it will also work if it's used localhost:8080
- To use the JSON-SERVER API the 3 lines from 25 should be be as following: 
    ```js
    const response = await axios.get("http://localhost:8080/data")
    const currentValue = response.data.map((item: IData) => [item.date, item.value])
    const errorFormatted = response.data.map((item: IData) => [item.date, item.error])
    ```