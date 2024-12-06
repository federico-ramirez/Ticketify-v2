import { deleteTier, updateTier } from "../../helpers/AdminHelper";
import { allTierServices } from "../../services/TierServices";
import { toast } from "react-toastify";
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import SaveButton from "../SaveButton/SaveButton";

const TierAdminCard = ({ tiers = [] }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tierToEdit, setTierToEdit] = useState({})

    const onClickDelete = (id) => {
        swal({
            title: "Confirmar acción",
            text: "Está apunto de borrar un registro permanentemente ¿Está seguro que desea continuar?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                deleteTier(id)
            } 
          });
    }

    const onClose = () => {
        setIsModalOpen(false)
    }

    async function getTierById(id) {
        try {
            const response = await allTierServices.getOneById(id)
            
            if (!response.success) {
                toast("Algo salió mal", { type: 'error' })
                throw new Error('Something was wrong')
            }
            
            setTierToEdit(response.items)
            setIsModalOpen(true)
            
        } catch (error) {
            console.error(error)
        }
    }

    async function deleteTier(id) {
        try {
            const response = await allTierServices.deleteTier(id);
            if (!response.success) {
                toast("Algo salió mal.", { type: 'error' })
                throw new Error('Something was wrong')
            }

            toast("Categoría eliminada", { type: 'success' })
            window.location.reload()
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 place-items-center">
            {
                tiers.map(tier => {
                    return (
                        <div key={tier.id} className="w-full max-w-full p-2">
                            <div className='max-w-xl lg:h-54 m-auto p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl font-montserrat font-medium'>
                                <p className='mb-2  text-dark-violet break-words'><b>Localidad </b>{tier.tier}</p>
                                <p className='mb-2 text-dark-violet break-words'><b>Precio </b>${tier.price.toFixed(2)} - <b>Capacidad </b> {tier.capacity} </p>
                                <p className='mb-2 text-dark-violet break-words'><b>Evento </b> {tier.event.title}</p>
                                <div className='space-x-2 text-right h-max mt-4'>
                                    <button 
                                        onClick={() => getTierById(tier.id)}
                                        type='submit'
                                        className='rounded-lg left-2 bg-golden-yellow hover:bg-yellow-400 w-12 h-12 max-h-fit p-2 text-white md:text-sm my-auto font-montserrat'>
                                        <span><EditIcon className='align-text-center' /> </span>
                                    </button>
                                    <button onClick={() => onClickDelete(tier.id)} className='rounded-lg bg-danger-red hover:bg-red-700 w-12 h-12 max-h-fit p-2 text-white md:text-sm my-auto font-montserrat' type='submit'>
                                        <span><DeleteIcon className='align-text-center' />  </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {isModalOpen && (
                <EditTierModal tier={tierToEdit} onClose={onClose} />
            )}
        </div>
    )
}

function EditTierModal({ tier, onClose }) {

    const [name, setName] = useState(tier.tier)
    const [price, setPrice] = useState(tier.price)
    const [capacity, setCapacity] = useState(tier.capacity)

    const onChange = (e, save) => {
        save(e.target.value);
    }

    async function onSubmit(e) {
        e.preventDefault();
        updateTier()
    }

    async function updateTier() {
        try {
            if (name != '' && price != '' && capacity != '') {
                const response = await allTierServices.updateTier(tier.id, name, capacity, price)

                if (!response.success) {
                    toast("Algo salió mal!!! Intentelo en otro momento", { type: "error" })
                    throw new Error("Algo salió mal !!! :/")
                }

                toast('Localidad actualizada correctamente', { type: 'success' })
                window.location.reload()
            } else if (name == '' || price == '' || capacity == '') {
                toast("Campos vacíos, favor completar formulario", { type: 'warning' })
            }
        } catch (error) {
            console.error({ error })
        }
    }

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white w-full md:w-1/2 p-4 rounded-lg shadow-md h-fit overflow-y-auto">
                <h2 className="text-lg font-semibold">Editar localidad</h2>
                <div>
                    <form action="post" onSubmit={onSubmit} className="font-montserrat font-medium">
                        <div className="p-4">
                            <label htmlFor="tierName" className="block mb-2 text-base text-dark-violet">Nombre de la localidad</label>
                            <input
                                type="text"
                                id="tierName"
                                onChange={(e) => onChange(e, setName)}
                                value={name}
                                autoComplete="off"
                                placeholder="Nombre de la localidad"
                                className="block w-full mb-4 p-2 text-dark-violet  border border-dark-violet rounded-lg text-base hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="grid grid-flow-cols grid-cols-1 md:grid-cols-2">
                                <div className="mb-2 md:pr-2">
                                    <label htmlFor="tierPrice" className="block mb-2 text-base text-dark-violet">Precio ($)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        id="tierPrice"
                                        onChange={(e) => onChange(e, setPrice)}
                                        value={price}
                                        placeholder="Precio"
                                        className="block w-full mb-4 p-2 text-dark-violet  border border-dark-violet rounded-lg text-base hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="tierCapacity" className="block mb-2 text-base text-dark-violet">Capacidad</label>
                                    <input
                                        type="number"
                                        id="tierCapacity"
                                        onChange={(e) => onChange(e, setCapacity)}
                                        value={capacity}
                                        min="1"
                                        placeholder="Capacidad"
                                        className="block w-full mb-4 p-2 text-dark-violet  border border-dark-violet rounded-lg text-base hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={onClose}
                                    className='rounded-lg bg-gray-500 hover:bg-gray-400 w-32 h-1/2 max-h-fit p-2 mr-2 text-white md:text-sm my-auto font-montserrat'
                                    type='button'>
                                    <span><CancelIcon className='mr-2 align-text-top' fontSize='small' /> Cancelar </span>
                                </button>
                                <SaveButton />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TierAdminCard