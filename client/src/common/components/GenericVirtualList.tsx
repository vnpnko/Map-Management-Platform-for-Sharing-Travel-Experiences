// import React from "react";
// import { Text, Box, Spinner } from "@chakra-ui/react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { Place } from "../../models/Place";
// import useInfiniteFetchItems from "../hooks/useInfiniteFetchItems";
//
// interface GenericVirtualListProps<T> {
//   items: T[] | undefined;
//   objType: "places" | "maps" | "users";
//   idType: string | number;
//   isLoading: boolean;
//   error: unknown;
//   renderItem: (item: T) => React.ReactNode;
//   emptyMessage?: string;
// }
//
// function GenericVirtualList<T>({
//   items,
//   objType,
//   idType,
//   isLoading,
//   error,
//   renderItem,
//   emptyMessage = "No items available",
// }: GenericVirtualListProps<T>) {
//   const {
//     items: itemObjects,
//     fetchNextPage,
//     hasNextPage,
//     status,
//     isFetchingNextPage,
//   } = useInfiniteFetchItems<T, idType>({
//     itemIds: items,
//     pageSize: 3,
//     endpoint: "places",
//   });
//
//   if (status === "pending") {
//     return (
//       <Box textAlign="center" color="black" p={4}>
//         <Spinner />
//       </Box>
//     );
//   }
//
//   if (status === "error") {
//     return (
//       <Box textAlign="center" p={4}>
//         <Text color="red.500">Error loading items.</Text>
//       </Box>
//     );
//   }
//
//   return (
//     <InfiniteScroll
//       dataLength={itemObjects.length}
//       next={() => fetchNextPage()}
//       hasMore={hasNextPage}
//       loader={
//         <Box textAlign="center" color="black" p={4}>
//           <Spinner />
//         </Box>
//       }
//       endMessage={
//         <Box textAlign="center" color="black" p={4}>
//           <Text>No more items.</Text>
//         </Box>
//       }
//     >
//       {itemObjects.map(renderItem)}
//
//       {isFetchingNextPage && (
//         <Box textAlign="center" color="black" p={4}>
//           <Spinner />
//         </Box>
//       )}
//     </InfiniteScroll>
//   );
// }
//
// export default GenericVirtualList;
