// import { useToastError } from "../../../../common/hooks/useToastError";
// import useAddMapToUser from "./useAddMapToUser";
// import useRemoveMapFromUser from "./useRemoveMapFromUser";
// import useAddMapLike from "./useAddMapLike";
// import useRemoveMapLike from "./useRemoveMapLike";
// import { Map } from "../../../../models/Map";
// import { loggedInUserStore } from "../../../../store/loggedInUserStore";
//
// export const useMapLikeHandler = (map: Map) => {
//   const { loggedInUser, setLoggedInUser } = loggedInUserStore();
//   const toastError = useToastError();
//
//   const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
//   const { removeMap, isRemovingMap } = useRemoveMapFromUser();
//   const { addMapLike, isAddingMapLike } = useAddMapLike();
//   const { removeMapLike, isRemovingMapLike } = useRemoveMapLike();
//
//   const alreadyLiked = loggedInUser?.maps.includes(map._id) ?? false;
//
//   const handleLike = async () => {
//     if (!loggedInUser) {
//       toastError({
//         title: "Not Authorized",
//         description: "Please log in to like a map.",
//       });
//       return;
//     }
//
//     try {
//       const payload = { mapId: map._id, userId: loggedInUser._id };
//       const updatedUser = await addMapToUser(payload);
//       await addMapLike(payload);
//       setLoggedInUser(updatedUser);
//       map.likes.push(loggedInUser._id);
//     } catch (err) {
//       toastError({
//         title: "Error Adding Map",
//         description: (err as Error).message,
//       });
//     }
//   };
//
//   const handleUnlike = async () => {
//     if (!loggedInUser) return;
//
//     try {
//       const payload = { mapId: map._id, userId: loggedInUser._id };
//       const updatedUser = await removeMap(payload);
//       await removeMapLike(payload);
//       setLoggedInUser(updatedUser);
//       map.likes = map.likes.filter((id) => id !== loggedInUser._id);
//     } catch (err) {
//       toastError({
//         title: "Error Removing Map",
//         description: (err as Error).message,
//       });
//     }
//   };
//
//   const isPending =
//     isAddingMapToUser || isRemovingMap || isAddingMapLike || isRemovingMapLike;
//
//   return { alreadyLiked, handleLike, handleUnlike, isPending };
// };
