import React, { useContext } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import HighlightedJSON from "../HighlightedJSON";
import { Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserInfoModal() {
  // const center = {
  //   display: "flex",
  //   width: "100%",
  //   justifyContent: "center",
  //   padding: "15px 0 0 0",
  // };

  const { user_info } = useContext(UserProfileContext);
  // const user_info_to_json = JSON.stringify(user_info, null, 2);
  // const isObject = (obj) => obj != null && obj.constructor.name === "Object";
  // function getKeys(obj, keepObjKeys, skipArrays, keys = [], scope = []) {
  //   if (Array.isArray(obj)) {
  //     if (!skipArrays) scope.push("[" + obj.length + "]");
  //     obj.forEach(
  //       (o) => getKeys(o, keepObjKeys, skipArrays, keys, scope),
  //       keys
  //     );
  //   } else if (isObject(obj)) {
  //     Object.keys(obj).forEach((k) => {
  //       if ((!Array.isArray(obj[k]) && !isObject(obj[k])) || keepObjKeys) {
  //         let path = scope.concat(k).join(".").replace(/\.\[/g, "[");
  //         if (!keys.includes(path)) keys.push(path);
  //       }
  //       getKeys(obj[k], keepObjKeys, skipArrays, keys, scope.concat(k));
  //     }, keys);
  //   }
  //   return keys;
  // }
  // const keys = getKeys(user_info, true, true);
  // console.log(user_info);
  // // console.log(user_info[getKeys(user_info, true, true)]);
  // let values = [];
  // for (let i = 0; i < keys.length; i++) {
  //   values.push(user_info[keys[i]]);
  // }
  // const style = {
  //   width: "50%",
  //   overflow: "auto",
  //   height: "800px",
  // };

  const keys = [
    "id",
    "name",
    "proxy",
    "previous_owner_update",
    "last_owner_update",
    "last_account_update",
    "created",
    "mined",
    "recovery_account",
    "last_account_recovery",
    "reset_account",
    "comment_count",
    "lifetime_vote_count",
    "post_count",
    "can_vote",
    "voting_power",
    "balance",
    "savings_balance",
    "hbd_balance",
    "hbd_seconds",
    "hbd_seconds_last_update",
    "hbd_last_interest_payment",
    "savings_hbd_balance",
    "savings_hbd_seconds",
    "savings_hbd_seconds_last_update",
    "savings_hbd_last_interest_payment",
    "savings_withdraw_requests",
    "reward_hbd_balance",
    "reward_hive_balance",
    "reward_vesting_balance",
    "reward_vesting_hive",
    "vesting_shares",
    "delegated_vesting_shares",
    "received_vesting_shares",
    "vesting_withdraw_rate",
    "post_voting_power",
    "next_vesting_withdrawal",
    "withdrawn",
    "to_withdraw",
    "withdraw_routes",
    "pending_transfers",
    "curation_rewards",
    "posting_rewards",
    "proxied_vsf_votes",
    "witnesses_voted_for",
    "last_post",
    "last_root_post",
    "last_vote_time",
    "post_bandwidth",
    "pending_claimed_accounts",
    "governance_vote_expiration_ts",
    "delayed_votes",
    "open_recurrent_transfers",
    "vesting_balance",
    "reputation",
    "transfer_history",
    "market_history",
    "post_history",
    "vote_history",
    "other_history",
    "tags_usage",
    "guest_bloggers",
  ];

  // console.log(user_info["id"]);
  return (
    <>
      {keys.map((key, index) => {
        const render_key = () => {
          if (key === "recovery_account" || key === "reset_account") {
            return <Link to={`/user/${user_info[key]}`}>{user_info[key]}</Link>;
          } else return user_info[key];
        };

        return (
          <Card key={index} style={{ borderRadius: "0" }}>
            <Card.Body style={{ padding: "5px" }}>
              <Row>
                <Col>{key}</Col>
                <Col
                  style={{ wordBreak: "break-word", textAlign: "end" }}
                  className=" d-flex justify-content-end "
                >
                  {typeof user_info?.[key] != "string"
                    ? JSON.stringify(user_info?.[key])
                    : render_key()}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}
