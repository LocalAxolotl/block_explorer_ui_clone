import { useState, createContext, useEffect } from "react";

import axios from "axios";

export const UserProfileContext = createContext();
export const UserProfileContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState("");
  const [user_profile_data, setUser_profile_data] = useState([]);
  const [acc_history_limit, set_acc_history_limit] = useState(100);
  const [op_filters, set_op_filters] = useState([]);
  const [user_info, set_user_info] = useState("");
  const [op_types, set_op_types] = useState([]);
  const [pagination, set_pagination] = useState(-1);
  const [resource_credits, set_resource_credits] = useState({});

  console.log(userProfile);

  //Get available operation types for current user
  useEffect(() => {
    if (userProfile !== "") {
      axios({
        method: "post",
        url: "http://192.168.5.118:3002/rpc/get_acc_op_types",

        headers: { "Content-Type": "application/json" },
        data: {
          _account: userProfile,
        },
      }).then((res) => set_op_types(res.data));
    }
  }, [userProfile, set_op_types]);
  //  Get user profile data #2
  const calc_limit =
    pagination !== -1 && acc_history_limit > pagination
      ? pagination
      : acc_history_limit;
  useEffect(() => {
    if (userProfile !== "") {
      axios({
        method: "post",
        // url: "http://192.168.5.118:3002/rpc/get_ops_by_account",
        url: "http://192.168.5.118:3002/rpc/get_ops_by_account",
        headers: { "Content-Type": "application/json" },
        data: {
          _account: userProfile,
          _start: pagination,
          _limit: calc_limit,
          _filter: op_filters,
        },
      }).then((res) => setUser_profile_data(res.data));
      axios({
        method: "post",
        url: "https://api.hive.blog",
        data: {
          jsonrpc: "2.0",
          method: "condenser_api.get_accounts",
          params: [[userProfile]],
          id: 1,
        },
      }).then((res) => set_user_info(res?.data?.result[0]));
      axios({
        method: "post",
        url: "https://api.hive.blog",
        data: {
          jsonrpc: "2.0",
          method: "rc_api.find_rc_accounts",
          params: { accounts: [userProfile] },
          id: 1,
        },
      }).then((res) => set_resource_credits(res?.data?.result?.rc_accounts[0]));
    }
  }, [
    userProfile,
    pagination,
    op_filters,
    acc_history_limit,
    setUser_profile_data,
  ]);

  return (
    <UserProfileContext.Provider
      value={{
        resource_credits: resource_credits,
        set_pagination: set_pagination,
        pagination: pagination,
        userProfile: userProfile,
        setUser_profile_data: setUser_profile_data,
        user_profile_data: user_profile_data,
        setUserProfile: setUserProfile,
        set_acc_history_limit: set_acc_history_limit,
        acc_history_limit: acc_history_limit,
        set_op_filters: set_op_filters,
        user_info: user_info,
        op_types: op_types,
        op_filters: op_filters,
        set_op_filters: set_op_filters,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
