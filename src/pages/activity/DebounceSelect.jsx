import { useState, useRef, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import { Select, Spin } from "antd";
import { getAddressList } from "../../api/serviceAPI";
const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    try {
      const res = await getAddressList({ code: props.item.code });
      if (res.data.length > 0) {
        setOptions(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions.data);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={(options || []).map((d) => ({
        value: d.pharmacyCode,
        label: d.pharmacyName,
      }))}
    />
  );
};

export default DebounceSelect;
