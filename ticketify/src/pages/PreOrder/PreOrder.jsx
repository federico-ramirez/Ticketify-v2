import React, { useEffect, useState } from 'react'
import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import LocationCard from '../../components/CardLocation/LocationCard'
import iconCalendar from '../../assets/img/iconCalendar.png'
import iconClock from '../../assets/img/iconClock.png'
import iconTicket from '../../assets/img/iconTicket.png'
import arrowBack from '../../assets/img/arrowBack.png'
import { useParams } from "react-router-dom";
import { getEventByName } from '../../services/UserService';
import moment from 'moment'

function PreOrder() {
    const { code } = useParams();
    const [number, setNumber] = useState(1);
    const [event, setEvent] = useState();
    const [idTier, setIdTier] = useState();
    const [total, setTotal] = useState();

    const handleIncrease = () => {
        setNumber(prevNumber => prevNumber + 1);
    }
    
    const handleDecrease = () => {
        setNumber(prevNumber => prevNumber - 1);
    }

    const handleClick = (id) => {
        setIdTier(id);
    }

    useEffect(() => {
        console.log(number);
    }, [number]);

    useEffect(() => {
        // if (idTier !== undefined) {
            const ticketPrice = event?.tiers.find(ticket => ticket.id === idTier)?.price || 0;
            const calculatedTotal = number * ticketPrice;
            setTotal(calculatedTotal);
        // }
    }, [number, idTier, event]);

    useEffect(() => {
        if (!event) {
            async function fetchEvent() {
                let response = await getEventByName(code);
                if (response.success) {
                    setEvent(response.event);
                }
            }
            fetchEvent();
        }
    }, [event, code]);

    return (
        <div className="font-montserrat">
            <Navbar />
            <div>
                <img src={event?.event.image} alt="Imagen" className="h-60 w-full" />
            </div>
            <a href={'/events'}>
                <div className="flex items-center m-4">
                    <img src={arrowBack} alt="Google" className="h-4 w-2 inline-block" />
                    <p className="text-pure-indigo text-l font-extralight m-2">Atras</p>
                </div>
            </a>

            <p className="text-pure-indigo text-3xl font-extrabold m-4">{event?.event.title}</p>

            <div className="flex flex-wrap m-2">
                <div className="p-2">
                    <div className="bg-pure-indigo rounded-full py-2 px-4 flex items-center">
                        <img src={iconCalendar} alt="Google" className="h-4 w-4 inline-block" />
                        <p className="text-white font-normal inline-block ml-2">{moment(event?.event.date).format('YYYY-MM-DD')}</p>
                    </div>
                </div>
                <div className="p-2">
                    <div className="bg-pure-indigo rounded-full py-2 px-4 flex items-center">
                        <img src={iconClock} alt="Google" className="h-4 w-4 inline-block" />
                        <p className="text-white font-normal inline-block ml-2">{moment(event?.event.hour).format('HH:mm A')}</p>
                    </div>
                </div>
            </div>

            <p className="ml-4 font-semibold text-xl">Localidades</p>

            <div className="flex flex-wrap">
                {event?.tiers?.map((ticket) => (
                    <LocationCard
                        key={ticket.id}
                        title={ticket.tier}
                        price={ticket.price}
                        selected={() => handleClick(ticket.id)}
                    />
                ))}
            </div>

            <div className="flex items-center m-4">
                <p className="mr-4 font-normal text-lg">Cantidad de tickets</p>
                <button className="p-2 bg-pure-indigo text-white font-bold rounded-l" onClick={handleDecrease}>
                    -
                </button>
                <span className="px-5 border-indigo bg-white">{number}</span>
                <button className="p-2 bg-pure-indigo text-white font-bold rounded-r" onClick={handleIncrease}>
                    +
                </button>
            </div>

            <a
                href={`/cartorder/${number}/${idTier}/${total}/`}
            >
                <div className="flex justify-end m-4">
                    <button className="bg-pure-indigo text-white font-normal rounded-lg py-2 px-4 flex items-center">
                        <img src={iconTicket} alt="Google" className="h-4 w-4 inline-block" />
                        <span className="ml-2 font-normal">Comprar</span>
                    </button>
                </div>
            </a>
            <Footer />
        </div>
    )
}

export default PreOrder
