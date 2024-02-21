import { useRouter } from "next/router";
import Hive from "@/types/Hive";
import { addSpacesAndCapitalizeFirst } from "@/utils/StringUtils";
import DetailedOperationCard from "@/components/DetailedOperationCard";
import Link from "next/link";
import moment from "moment";
import { config } from "@/Config";
import PageNotFound from "@/components/PageNotFound";
import { useUserSettingsContext } from "@/components/contexts/UserSettingsContext";
import JSONView from "@/components/JSONView";
import useTransactionData from "@/api/common/useTransactionData";
import { useOperationsFormatter } from "@/utils/Hooks";

const displayTransactionData = (
  key: string,
  value: string | string[] | number | Date | Hive.Operation[] | Object
) => {
  if (value instanceof Array || value instanceof Object) {
    return null;
  } else {
    return (
      <tr
        key={key}
        className="border-b border-solid border-gray-700 max-w-full overflow-hidden flex flex-col md:table-row"
      >
        <td className="pl-2 py-1">{addSpacesAndCapitalizeFirst(key)}</td>
        <td align="right" className="pr-2">
          {typeof value === "number" ? value.toLocaleString() : value}
        </td>
      </tr>
    );
  }
};

export default function Transaction() {
  const router = useRouter();
  const { settings } = useUserSettingsContext();
  const transactionId = router.query.transactionId as string;

  const { trxData, trxLoading, trxError } = useTransactionData(transactionId);

  const formattedTransaction = useOperationsFormatter(trxData) as Hive.TransactionQueryResponse | undefined;

  if (trxError) {
    return <PageNotFound message={`Transaction not found.`} />;
  }

  return (
    <div className="w-full max-w-5xl px-4 text-white">
      {!trxLoading && !!trxData && (
        <>
          <div className="w-full bg-explorer-dark-gray px-4 py-2 rounded flex flex-col justify-center md:items-center md:text-md" data-testid="transaction-header">
            <div data-testid="transaction-header-hash-trx">
              Transaction{" "}
              <span className="text-explorer-turquoise">
                {trxData.transaction_json.transaction_id}
              </span>
            </div>
            <div className="w-full flex justify-evenly">
              <div>
                Block
                <Link
                  href={`/block/${trxData.transaction_json.block_num}`}
                  className="text-explorer-turquoise"
                  data-testid="transaction-header-block-number"
                >
                  {" " + trxData.transaction_json.block_num}
                </Link>
              </div>
              <div data-testid="transaction-header-date">
                Date
                <span className="text-explorer-turquoise">
                  {" " +
                    moment(trxData.timestamp).format(
                      config.baseMomentTimeFormat
                    )}
                </span>
              </div>
            </div>
          </div>
          {settings.rawJsonView ? (
            <JSONView
              json={trxData}
              className="w-full md:w-[992px] mt-6 m-auto py-2 px-4 bg-explorer-dark-gray rounded text-white text-xs break-words break-all"
            />
          ) : (
            <>
              {formattedTransaction?.transaction_json.operations &&
                formattedTransaction.transaction_json.operations.map((operation, index) => (
                  <DetailedOperationCard
                    key={index}
                    operation={operation}
                    date={new Date(trxData.timestamp)}
                    blockNumber={trxData.transaction_json.block_num}
                    transactionId={trxData.transaction_json.transaction_id}
                    skipBlock
                    skipTrx
                    skipDate
                    className="mt-4"
                  />
                ))}
              <div className="mt-6 w-full bg-explorer-dark-gray py-2 rounded px-2" data-testid="transaction-details">
                <div className="flex justify-center text-md">
                  Transaction Details
                </div>
                {settings.rawJsonView ? (
                  <JSONView
                    json={trxData.transaction_json}
                    className="text-xs"
                  />
                ) : (
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.keys(trxData.transaction_json).map((key) =>
                        displayTransactionData(
                          key,
                          trxData.transaction_json[
                            key as keyof Omit<
                              Hive.TransactionDetails,
                              "operations"
                            >
                          ]
                        )
                      )}
                      {Object.keys(trxData).map((key) =>
                        displayTransactionData(
                          key,
                          trxData[
                            key as keyof Omit<
                              Hive.TransactionQueryResponse,
                              "transaction_json"
                            >
                          ]
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
