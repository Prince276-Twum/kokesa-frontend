import { AppDispath, RootState } from "./store";
import { UseSelector, useDispatch, useSelector } from "react-redux";


export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispath>()