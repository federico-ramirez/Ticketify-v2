import React, { useState } from 'react'
import Footer from "../../components/Footer/Footer"
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin"
import { QrScanner } from '@yudiel/react-qr-scanner'
import Logo from '../../assets/img/successIcon.png';
import Error from '../../assets/img/error.png';
import { allExchangeServices } from '../../services/TicketExchangeServices'

function ExchangeTicket() {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState('');
  const [valid, setValid] = useState(false);

  const handleDecode = async (decodedResult) => {
    setResult(decodedResult)
    let response = await allExchangeServices.postTicketExchange(decodedResult);
    setScanned(true);
    setValid(response.success);
  };

  return (
    <div className="font-montserrat">
      <NavbarAdmin />
      <div className="flex justify-center items-center">
        <div className="w-full md:w-2/4 lg:w-1/3 sm:-2 m-12">
          {!scanned ? (
            <QrScanner
              onDecode={handleDecode}
              onError={(error) => console.log(error?.message)}
            />
          ) : (
            <>
              {valid ? (
                <div className="text-center mx-auto mt-16">
                  <p className="text-7xl font-bold mb-4 text-pure-indigo">¡Código QR válido!</p>
                  <p className="text-xl font-semibold">{result}</p>
                </div>
              ) : (
                <div className="text-center mx-auto mt-16">
                  <p className="text-7xl font-bold mb-4 text-pure-indigo">¡Código QR no válido!</p>
                </div>
              )}
              <div className='flex justify-center'>
                <img className='h-36' src={!valid ? Error : Logo} alt='ticketify' />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ExchangeTicket
