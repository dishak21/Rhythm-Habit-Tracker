const getFormattedDate = (date: Date) => {
    const options = { year: "numeric", month: "long", day: "numeric" }; // Format: November 30, 2024
    return date.toLocaleDateString(undefined, options);
  };



  export default getFormattedDate