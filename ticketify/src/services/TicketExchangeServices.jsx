import { ticketExchange } from "../helpers/AdminHelper";

const services = {};

export const allExchangeServices = {
    postTicketExchange: async ( qr ) => {
        try {
            const result = await ticketExchange(qr)
            return { success: true }
        } catch (error) {
            return { success: false }
        }
    }
}