// lib/errorHandler.ts
interface ReturnTypes {
    title: string
    description: string
}
export const handleApiError = (error: any): ReturnTypes  => {
    switch (error?.type) {
        case "validation_error":
            return {
                title: error.message,
                description: error.error.details,
            }

        case "invalid_credentials":
            return {
                title: error.message,
                description: error.error.details,
            }
            // toast({
            //     title: error.message,
            //     description: error.error.details,
            //     variant: "destructive",
            // });

        case "server_error":
            return {
                title: error.message,
                description: error.error.details,
            }
            // toast({
            //     title: "Server Error",
            //     description: "Something went wrong on our side. Please try again later.",
            //     variant: "destructive",
            // });
            break;

        default:
        // toast({
        //     title: "Unexpected Error",
        //     description: error?.message || "Something went wrong",
        //     variant: "destructive",
        // });
        return {
                title: error.message,
                description: error.error.details,
            }
    }
}
