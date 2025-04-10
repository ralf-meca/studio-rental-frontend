import {useEffect, useState} from "react";
import axios from "axios";

export const useGetRentalsListData = (showOnlyAvailable: boolean) => {
    const [rentalList, setRentalList] = useState<any[]>([])
    const [isRentalListLoading, setIsRentalListLoading] = useState<boolean>(false)
    const [refetchRentalsList, setRefetchRentalsList] = useState<boolean>(false)
    // Get the list of the rentals on page landing
    const getRentalsListData = async () => {
        try {
            const response = await axios.get("/api/rentals");
            const data = showOnlyAvailable ? response?.data?.filter((el: any) => el.status === "available") : response?.data
            // We set the value from the response
            setRentalList(data?.map((el: any) => ({
                id: el?._id,
                image: el?.img,
                name: el?.name,
                description: el?.description,
                price: el?.price,
                quantity: el?.quantity,
                status: el?.status
            })) ?? [])
        } catch (error) {
            console.error('Error fetching the rentals', error);
        }
    }


    // First we call the api and populate the list on page landing, then on everytime we have to refetch this data
    useEffect(() => {
        setIsRentalListLoading(true)
        getRentalsListData().then(() => setIsRentalListLoading(false))
    }, [])

    useEffect(() => {
        setIsRentalListLoading(true)
        getRentalsListData().then(() => setIsRentalListLoading(false))
    }, [refetchRentalsList])



    return {
        rentalList,
        isRentalListLoading,
        setRefetchRentalsList,
    }
}