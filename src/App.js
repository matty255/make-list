import axios from "axios";
import { useEffect, useState, useRef } from "react";

const App = () => {
  // states
  const [loading, setLoading] = useState(true);
  const [allList, setallList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastElement, setLastElement] = useState(null);
  const [end, setEnd] = useState(false);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum((no) => no + 1);
      }
    })
  );

  // api call
  const callList = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `https://my-json-server.typicode.com/dmlafiki/jsons/data/${pageNum}`
      );
      let list = response.data.list;
      let all = new Set([...allList, ...list]);
      console.log(all);
      setallList([...all]);
      setLoading(false);
    } catch (error) {
      setEnd(true);
      setLoading(false);
      alert("끝!");
    }
  };

  useEffect(() => {
    if (!end) {
      callList();
    }
  }, [pageNum]);

  // infinite scroll
  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  // each card
  const ItemCard = ({ data }) => {
    return (
      <div className="p-4 m-2 border border-gray-400 rounded-md bg-white flex items-center flex-col">
        <div>
          <img src={data.image} className="w-full" alt="Item" />
        </div>

        <div>
          <p className="text-base font-bold">{data.title}</p>
          <p className="text-sm text-gray-800">{data.content}</p>
        </div>
      </div>
    );
  };

  // render
  return (
    <div className="mx-auto bg-gray-100 p-6">
      <h1 className="text-3xl text-center mt-4 mb-10">아이템리스트</h1>

      <div className="w-full md:w-2/3 mx-auto">
        {allList.length > 0 &&
          allList.map((Item, i) => {
            return i === allList.length - 1 && !loading && !end ? (
              <div key={`${Item.id}-${i}`} ref={setLastElement}>
                <ItemCard data={Item} />
              </div>
            ) : (
              <ItemCard data={Item} key={`${Item.id}-${i}`} />
            );
          })}
      </div>

      {loading && <p className="text-center">loading...</p>}
      {end && <p className="text-center my-10">여기가 페이지 끝입니다!</p>}
    </div>
  );
};

export default App;
