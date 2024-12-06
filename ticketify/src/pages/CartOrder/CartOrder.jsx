import React from 'react'
import Image1 from '../../assets/img/imagen2.png'
import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import iconCart from '../../assets/img/iconCart.png'
import arrowBack from '../../assets/img/arrowBack.png'
import { createTicketOrder } from '../../services/UserService'
import { useParams } from "react-router-dom";

function CartOrder() {
    const { quantity, tier, total } = useParams();

    const iva = total * 0.10;   
    const finalTotal = total + iva;

    const handlePayment = async () => {
       const response = await createTicketOrder(quantity, tier);
       if (response.success) {
        window.location.href = '../../../../../';
        console.log("success!!")
       } else {
        console.log("Error")
       }
    };

    return (
        <div className="font-montserrat">
            <Navbar />
            <a href={'/preorder'}>
                <div>
                    <img src={Image1} alt="Imagen" className="object-fill h-60 w-full" />
                </div>

                <div className="flex items-center m-4">
                    <img src={arrowBack} alt="Google" className="h-4 w-2 inline-block" />
                    <p className="text-pure-indigo text-l font-extralight m-2">Atras</p>
                </div>
            </a>

            <div className="flex justify-center">
                <div className="border shadow-md p-4 rounded-lg">
                    <h2 className="text-2xl text-center font-normal mb-4">Orden de pago</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold py-2 px-4">Total Tickets</p>
                        </div>

                        <div>
                            <p className="font-normal py-2 px-4">{quantity}</p>
                        </div>

                    </div>

                    <hr className='h-0.5 bg-white' />

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <p className="font-semibold py-2 px-4">Subtotal</p>
                            <p className="font-semibold py-2 px-4">Impuestos</p>
                            <p className="text-lg font-bold py-2 px-4">Total</p>
                        </div>

                        <div>
                            <p className="font-normal text-lg py-2 px-4">${total}</p>
                            <p className="font-normal text-lg py-2 px-4">${iva}</p>
                            <p className="font-normal text-lg py-2 px-4">${finalTotal}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end m-4">
                <button className="bg-pure-indigo text-white font-normal rounded-lg py-2 px-4 flex items-center" onClick={handlePayment} type='submit'>
                    <img src={iconCart} alt="Google" className="h-4 w-4 inline-block" />
                    <span className="ml-2 font-normal">Pagar</span>
                </button>
            </div>

            <Footer />
        </div>
    )
}

export default CartOrder
