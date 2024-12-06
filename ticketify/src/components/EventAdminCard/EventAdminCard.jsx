import { allEventServices } from "../../services/EventServices";
import { toast } from "react-toastify";
import { useState } from "react";
import CloudinaryUploadWidget, {
  IMAGE_URL,
} from "../CloudinaryUploadWidget/CloudinaryUploadWidget";
import { Select } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";
import { allCategoryServices } from "../../services/CategoryServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import moment from "moment-timezone";
import SaveButton from "../SaveButton/SaveButton";

const URLImageRegex = /(https?:\/\/.*\.(?:png|jpg))/i;
const DEFAULT_IMG =
  "https://i.pinimg.com/564x/7e/96/cb/7e96cb6920cfc61852ec4b8c119d8b3c.jpg";

const EventAdminCard = ({ events = [], categories = [] }) => {
  moment.locale();

  const [eventToEdit, setEventToEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function changeEventStatus(title) {
    try {
      const response = await allEventServices.changeStatus(title);
      if (!response.success) {
        toast("Algo salió mal.", { type: "error" });
        throw new Error("Something was wrong");
      }

      toast("Estado cambiado", { type: "success" });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  async function getEventById(id) {
    try {
      const response = await allEventServices.getEventById(id);
      if (!response.success) {
        toast("Algo salió mal", { type: "error" });
        throw new Error("Something was wrong");
      }
      setEventToEdit(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 place-items-center">
      {events.map((event) => {
        let date = event.date.split("T")[0];
        const expression = /T(.*?)\./;
        let match = event.hour.match(expression);
        let hour = "";
        if (match) {
          hour = match[1].substring(0, 5);
        }

        return (
          <div key={event.id} className="min-w-full max-w-xl px-8 py-4">
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md hover:shadow-2xl md:flex-row min-w-full md:max-w-full max-h-full md:h-80 md:max-h-80 font-montserrat">
              <img
                className="object-cover w-full rounded-t-lg h-72 md:h-80 md:w-44 md:rounded-none md:rounded-l-lg"
                src={event.image ? event.image : DEFAULT_IMG}
                alt={event.title}
              />
              <div className="flex flex-col justify-between px-8 py-6 leading-normal text-sm w-full md:h-80 md:max-h-80">
                <p className="mb-1 font-medium text-dark-violet break-words text-base">
                  <b> {event.title} </b>
                </p>
                <p className="mb-1 font-medium text-dark-violet break-words">
                  <b>Fecha y hora </b> {moment(date).format("DD/MM/YYYY")} -{" "}
                  {hour}{" "}
                </p>
                <p className="mb-1 font-medium text-dark-violet break-words">
                  <b>Categoria </b> {event.category?.category}{" "}
                </p>
                <p className="font-medium text-dark-violet break-words">
                  <b>Lugar</b> {event.place}
                </p>
                <p className="font-medium text-dark-violet break-words">
                  <b>Dirección </b>
                </p>
                <p className="mb-1 font-medium text-dark-violet break-words">
                  {" "}
                  {event.address}{" "}
                </p>
                <p className="mb-2 font-medium text-dark-violet break-words ">
                  {event.status ? (
                    <span className="text-pure-green">
                      <CheckCircleIcon /> Activo{" "}
                    </span>
                  ) : (
                    <span className="text-danger-red">
                      <CancelIcon /> Inactivo{" "}
                    </span>
                  )}
                </p>
                <div className="space-x-2 text-right w-full">
                  <button
                    onClick={() => getEventById(event.id)}
                    type="submit"
                    className="rounded-lg left-2 bg-golden-yellow hover:bg-yellow-400 w-12 h-12 max-h-fit p-2 text-white md:text-sm my-auto font-montserrat"
                  >
                    <span>
                      <EditIcon className="align-text-center" />{" "}
                    </span>
                  </button>
                  <button
                    onClick={() => changeEventStatus(event.id)}
                    className="rounded-lg bg-orange-600 hover:bg-orange-500 w-12 h-12 max-h-fit p-2 text-white md:text-sm my-auto font-montserrat"
                    type="submit"
                  >
                    {event.status ? (
                      <span>
                        {" "}
                        <VisibilityOffIcon />{" "}
                      </span>
                    ) : (
                      <span>
                        {" "}
                        <VisibilityIcon />{" "}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {isModalOpen && (
        <EditEventModal
          event={eventToEdit}
          categories={categories}
          onClose={onClose}
        />
      )}
    </div>
  );
};

function EditEventModal({ event, categories, onClose }) {
  let formatedDate = event.date.split("T")[0];
  const expression = /T(.*?)\./;
  let match = event.hour.match(expression);
  let formatedHour = "";
  if (match) {
    formatedHour = match[1].substring(0, 5);
  }

  const [title, setTitle] = useState(event.title);
  const [image, setImage] = useState(event.image);
  const [newImage, setNewImage] = useState("");
  const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);
  const [date, setDate] = useState(formatedDate);
  const [hour, setHour] = useState(formatedHour);
  const [place, setPlace] = useState(event.place);
  const [address, setAddress] = useState(event.address);
  const [category, setCategory] = useState(event.category.id);
  const [eventCategory, setEventCategory] = useState(event.category.category);

  const [value, setValue] = useState({
    startDate: date,
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    console.log(newValue);
    setDate(newValue.startDate);
    console.log(moment(newValue.startDate).format("DD/MM/YYYY"));
  };

  async function getCategoryId(name) {
    if (typeof name === undefined || name !== "") {
      const categoryResponse = await allCategoryServices.getCategoryByName(
        name
      );
      setCategory(categoryResponse.data.id);
      setEventCategory(categoryResponse.data.category);
      return categoryResponse.data.id;
    } else {
      toast("Seleccione una categoría válida", { type: "warning" });
    }
  }

  const onIndexChange = (e, save) => {
    getCategoryId(e.target.value);
    save(e.target.value);
  };

  const onChange = (e, save) => {
    save(e.target.value);
  };

  async function updateEvent() {
    try {
      let formatedDate = moment(date).format("DD/MM/YYYY");
      let newImg = "";
      let showImgToast = true;
      setNewImage(IMAGE_URL !== "" ? IMAGE_URL : image);

      if (IMAGE_URL !== "") {
        setNewImage(IMAGE_URL);
        setIsNewImageUploaded(true);
        newImg = IMAGE_URL;
      }

      if (isNewImageUploaded) {
        if (
          title != "" &&
          date != "" &&
          hour != "" &&
          place != "" &&
          address != "" &&
          category != "" &&
          newImage != ""
        ) {
          if (IMAGE_URL !== "") {
            setNewImage(IMAGE_URL);
            newImg = IMAGE_URL;
          } else {
            setNewImage(image);
            newImg = image;
          }
          const response = await allEventServices.updateEvent(
            event.id,
            title,
            newImg,
            formatedDate,
            hour,
            place,
            address,
            eventCategory
          );

          if (!response.success) {
            toast("Algo salió mal!!! Intentelo en otro momento", {
              type: "error",
            });
            throw new Error("Algo salió mal !!! :/");
          }

          toast("Evento actualizado correctamente", { type: "success" });
          showImgToast = false;
          window.location.reload();
        } else if (title == '' || address == '' || place == '' || date == '' || hour == '') {
          toast("Campos vacíos, favor completar formulario", { type: "warning" });
        }
      } else if (!isNewImageUploaded) {
        console.log("ok")
        if (
          title != event.title && title != '' ||
          place != event.place && place != '' ||
          address != event.address && address != '' ||
          (category != event.category.id && newImage != "")
        ) {
          console.log("1")
          if (IMAGE_URL !== "") {
            setNewImage(IMAGE_URL);
            newImg = IMAGE_URL;
          } else {
            setNewImage(image);
            newImg = image;
          }
          const response = await allEventServices.updateEvent(
            event.id,
            title,
            newImg,
            formatedDate,
            hour,
            place,
            address,
            eventCategory
          );

          if (!response.success) {
            toast("Algo salió mal!!! Intentelo en otro momento", {
              type: "error",
            });
            throw new Error("Algo salió mal !!! :/");
          }

          toast("Evento actualizado correctamente", { type: "success" });
          window.location.reload();
        } else if (title == '' || address == '' || place == '' || date == '' || hour == '') {
          toast("Campos vacíos, favor completar formulario", { type: "warning" });
        } 
      } 

      if (newImage != "" && IMAGE_URL !== "" && showImgToast) {
        toast(
          "Imagen subida, haga click el botón de 'Guardar' para actualizar",
          { type: "info" }
        );
        showImgToast = false;
      }
    } catch (error) {
      console.error({ error });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    updateEvent();
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
      <div className="bg-white w-10/12 md:w-1/2 py-2 px-4 rounded-lg shadow-md my-auto h-modal overflow-y-auto">
        <h2 className="text-lg text-penn-blue font-montserrat font-extrabold">Editar evento</h2>
        <div>
          <form
            action="post"
            className="font-montserrat font-medium"
            onSubmit={onSubmit}
          >
            <div className="p-4">
              <label
                htmlFor="eventName"
                className="block mb-2 text-base text-dark-violet font-bold"
              >
                Evento
              </label>
              <input
                type="text"
                id="title"
                onChange={(e) => onChange(e, setTitle)}
                value={title}
                autoComplete="off"
                placeholder="Nombre del evento"
                className="block w-full mb-4 p-2 text-dark-violet border border-dark-violet hover:border-violet-700 rounded-lg shadow-md text-base focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="grid grid-flow-cols grid-cols-1 md:grid-cols-2">
                <div className="mb-4 md:pr-2">
                  <label
                    htmlFor="date"
                    className="block mb-2 text-base text-dark-violet font-bold"
                  >
                    Fecha
                  </label>
                  <div id="date" className="relative w-full">
                    <Datepicker
                      containerClassName="border border-dark-violet rounded-lg hover:border-violet-700"
                      inputClassName="font-medium border border-white rounded-lg w-full shadow-md"
                      primaryColor={"indigo"}
                      asSingle={true}
                      useRange={false}
                      value={value}
                      defaultValue={date}
                      displayFormat="DD/MM/YYYY"
                      onChange={handleValueChange}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="eventTime"
                    className="block mb-2 text-base text-dark-violet font-bold"
                  >
                    Hora
                  </label>
                  <div className="relative w-full">
                    <input
                      datepicker="true"
                      datepicker-autohide="true"
                      type="time"
                      id="hour"
                      onChange={(e) => onChange(e, setHour)}
                      value={hour}
                      className="border border-dark-violet text-gray-900 text-base rounded-lg shadow-md hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Seleccione una hora"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-flow-cols grid-cols-1 md:grid-cols-2">
                <div className="mb-2 md:pr-2">
                  <label
                    htmlFor="eventCategory"
                    className="block mb-2 text-base text-dark-violet font-bold"
                  >
                    Categoría
                  </label>
                  <Select
                    id="eventCategory"
                    onChange={(e) => onIndexChange(e, setEventCategory)}
                    value={eventCategory}
                    defaultValue={event.category.category}
                    className="relative w-full mb-4 border border-dark-violet rounded-lg shadow-md text-dark-violet font-medium bg-white hover:border-violet-700 focus:ring-dark-violet focus:border-dark-violet"
                  >
                    {categories.map((category) => {
                      return (
                        <option key={category.id}> {category.category} </option>
                      );
                    })}
                  </Select>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="place"
                    className="block mb-2 text-base text-dark-violet font-bold"
                  >
                    Lugar
                  </label>
                  <input
                    type="text"
                    id="place"
                    onChange={(e) => onChange(e, setPlace)}
                    value={place}
                    autoComplete="off"
                    placeholder="Lugar del evento"
                    className="block w-full mb-4 p-2 text-dark-violet border border-dark-violet rounded-lg shadow-md text-base hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <label
                htmlFor="address"
                className="block text-base text-dark-violet font-bold"
              >
                Dirección
              </label>
              <textarea
                type="text"
                id="address"
                onChange={(e) => onChange(e, setAddress)}
                value={address}
                autoComplete="off"
                placeholder="Dirección del evento"
                className="block w-full mb-4 p-2.5 text-dark-violet  border border-dark-violet rounded-lg shadow-md text-base hover:border-violet-700 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="w-full h-12 mb-8" id="fileUpload">
                <label
                  htmlFor="image"
                  className="block text-base text-dark-violet font-bold"
                >
                  Imagen
                </label>
                <p className="block text-base truncate text-dark-violet">
                  {image}
                </p>
                <CloudinaryUploadWidget
                  value={image}
                  onChange={(e) => onChange(e, setImage)}
                />
              </div>
            </div>
            <div className="flex justify-end m-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-500 hover:bg-gray-400 w-32 h-1/2 max-h-fit p-2 mr-2 text-white md:text-sm my-auto font-montserrat"
                type="button"
              >
                <span>
                  <CancelIcon
                    className="mr-2 align-text-top"
                    fontSize="small"
                  />{" "}
                  Cancelar{" "}
                </span>
              </button>
              <SaveButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventAdminCard;
