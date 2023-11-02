import fetchingService from "@/services/FetchingService";
import { useQuery } from "@tanstack/react-query";
import OperationCard from "@/components/OperationCard";
import Hive from "@/types/Hive";
import { adjustDynamicGlobalBlockData } from "@/utils/QueryDataSelectors";
import HeadBlockCard from "@/components/home/HeadBlockCard";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { getHiveAvatarUrl } from "@/utils/HiveBlogUtils";
import BlockSearchSection from "@/components/home/BlockSearchSection";
import Explorer from "@/types/Explorer";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [foundBlocksIds, setFoundBlocksIds] = useState<number[] | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[] | null>(
    null
  );
  const [operationKeys, setOperationKeys] = useState<
    string[][] | null
  >(null);
  const [blockSearchLoading, setBlochSearchLoading] = useState<boolean>(false);

  function getGlobalBlockData() {
    return Promise.all([
      fetchingService.getDynamicGlobalProperties(),
      fetchingService.getCurrentPriceFeed(),
      fetchingService.getRewardFunds(),
    ]);
  }

  const dynamicGlobalQuery = useQuery({
    queryKey: [`global`],
    queryFn: getGlobalBlockData,
    select: (dynamicGlobalBlockData) =>
      adjustDynamicGlobalBlockData(
        dynamicGlobalBlockData[0],
        dynamicGlobalBlockData[1],
        dynamicGlobalBlockData[2]
      ),
    refetchOnWindowFocus: false,
  });

  const witnessesQuery = useQuery({
    queryKey: ["witnesses"],
    queryFn: () => fetchingService.getWitnesses(20, 0, "votes", "desc"),
    refetchOnWindowFocus: false,
  });

  const { data: operationsByBlock } = useQuery<
    Hive.OpsByBlockResponse[],
    Error
  >({
    queryKey: ["operationsByBlock"],
    queryFn: () =>
      fetchingService.getOpsByBlock(
        dynamicGlobalQuery.data?.headBlockNumber || 0,
        []
      ),
    enabled: !!dynamicGlobalQuery.data?.headBlockNumber,
    refetchOnWindowFocus: false,
  });

  const operationsTypes = useQuery({
    queryKey: ["operationsNames"],
    queryFn: () => fetchingService.getOperationTypes(""),
    refetchOnWindowFocus: false,
  });

  const getBlockDataForSearch = async (
    blockSearchProps: Explorer.BlockSearchProps
  ) => {
    setBlochSearchLoading(true);
    const { accountName, operations, fromBlock, toBlock, limit, deepProps } =
      blockSearchProps;
    let deepPropsKey: string[] | null =
      deepProps.keys && deepProps.keys.length !== 0 ? deepProps.keys : null;
    const foundBlocks = await fetchingService.getBlockByOp(
      operations,
      accountName,
      fromBlock,
      toBlock,
      limit,
      "desc",
      [deepProps.content],
      deepProps.keys ? [deepProps.keys] : null
    );
    setFoundBlocksIds(foundBlocks.map(foundBlock => foundBlock.block_num));
    setBlochSearchLoading(false);
  };

  const getOperationKeys = async (
    operationId: number | null
  ) => {
    if (operationId !== null) {

      const nextKeys = await fetchingService.getOperationKeys(
        operationId
      );
      setOperationKeys(nextKeys);
      setSelectedKeys(null);
    } else {
      setOperationKeys(null);
      setSelectedKeys(null);
    }
  };

  const setProperKeysForProperty = (index: number | null) => {
    if (index !== null && operationKeys?.[index]) {
      setSelectedKeys(operationKeys[index]);
    } else {
      setSelectedKeys(null);
    }
  }

  return (
    <div className="grid grid-cols-4 text-white mx-4 md:mx-8 w-full">
      <HeadBlockCard
        headBlockCardData={dynamicGlobalQuery.data}
        transactionCount={operationsByBlock?.length || 0}
      />
      <div className="col-start-1 md:col-start-2 col-span-6 md:col-span-2">
        <BlockSearchSection
          getBlockDataForSearch={getBlockDataForSearch}
          getOperationKeys={getOperationKeys}
          setSelectedKeys={setProperKeysForProperty}
          operationsTypes={operationsTypes.data || []}
          foundBlocksIds={foundBlocksIds}
          currentOperationKeys={operationKeys}
          operationKeysChain={selectedKeys}
          loading={blockSearchLoading}
        />
      </div>
      <div className="col-start-1 md:col-start-4 col-span-6 md:col-span-1 mt-6 bg-explorer-dark-gray py-2 rounded-[6px] text-xs	overflow-hidden md:mx-6">
        <div className=" text-lg text-center">Top Witnesses</div>
        <Table>
          <TableBody>
            {witnessesQuery.data &&
              witnessesQuery.data.map((witness, index) => (
                <TableRow className=" text-base" key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/account/${witness.witness}`}
                      className="text-explorer-turquoise"
                    >
                      {witness.witness}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/account/${witness.witness}`}>
                      <Image
                        className="rounded-full border-2 border-explorer-turquoise"
                        src={getHiveAvatarUrl(witness.witness)}
                        alt="avatar"
                        width={40}
                        height={40}
                      />
                    </Link>{" "}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
