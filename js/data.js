(function () {
  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const today = new Date();
  const pickupDate = toIsoDate(addDays(today, 2));
  const deliveryDate = toIsoDate(addDays(today, 3));

  const baseLanes = [
    {
      laneNumber: "LN-1001",
      originCity: "Dallas",
      originState: "TX",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 781,
      rate: 1952.5,
    },
    {
      laneNumber: "LN-1002",
      originCity: "Atlanta",
      originState: "GA",
      destinationCity: "Dallas",
      destinationState: "TX",
      miles: 781,
      rate: 1952.5,
    },
    {
      laneNumber: "LN-1003",
      originCity: "Chicago City",
      originState: "IL",
      destinationCity: "Dallas",
      destinationState: "TX",
      miles: 925,
      rate: 2312,
    },
    {
      laneNumber: "LN-1004",
      originCity: "Dallas",
      originState: "TX",
      destinationCity: "Houston",
      destinationState: "TX",
      miles: 240,
      rate: 600,
    },
    {
      laneNumber: "LN-1005",
      originCity: "Houston",
      originState: "TX",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 794,
      rate: 1985,
    },
    {
      laneNumber: "LN-1006",
      originCity: "Los Angeles",
      originState: "CA",
      destinationCity: "Phoenix",
      destinationState: "AZ",
      miles: 373,
      rate: 932.5,
    },
    {
      laneNumber: "LN-1007",
      originCity: "Phoenix",
      originState: "AZ",
      destinationCity: "Dallas",
      destinationState: "TX",
      miles: 1065,
      rate: 2662.5,
    },
    {
      laneNumber: "LN-1013",
      originCity: "Atlanta",
      originState: "GA",
      destinationCity: "Jacksonville",
      destinationState: "FL",
      miles: 346,
      rate: 865,
    },
    {
      laneNumber: "LN-1015",
      originCity: "Miami",
      originState: "FL",
      destinationCity: "Orlando",
      destinationState: "FL",
      miles: 236,
      rate: 590,
    },
    {
      laneNumber: "LN-1016",
      originCity: "Orlando",
      originState: "FL",
      destinationCity: "Charlotte",
      destinationState: "NC",
      miles: 527,
      rate: 1317.5,
    },
    {
      laneNumber: "LN-1041",
      originCity: "Orlando",
      originState: "FL",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 438,
      rate: 1095,
    },
    {
      laneNumber: "LN-1042",
      originCity: "Atlanta",
      originState: "GA",
      destinationCity: "Orlando",
      destinationState: "FL",
      miles: 438,
      rate: 1095,
    },
    {
      laneNumber: "LN-1045",
      originCity: "Atlanta",
      originState: "GA",
      destinationCity: "Charlotte",
      destinationState: "NC",
      miles: 245,
      rate: 612.5,
    },
    {
      laneNumber: "LN-1046",
      originCity: "Charlotte",
      originState: "NC",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 245,
      rate: 612.5,
    },
    {
      laneNumber: "LN-1047",
      originCity: "Atlanta",
      originState: "GA",
      destinationCity: "Nashville",
      destinationState: "TN",
      miles: 250,
      rate: 625,
    },
    {
      laneNumber: "LN-1050",
      originCity: "Jacksonville",
      originState: "FL",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 346,
      rate: 865,
    },
    {
      laneNumber: "LN-1079",
      originCity: "San Diego",
      originState: "CA",
      destinationCity: "Atlanta",
      destinationState: "GA",
      miles: 2150,
      rate: 5375,
    },
    {
      laneNumber: "LN-1075",
      originCity: "San Diego",
      originState: "CA",
      destinationCity: "Las Vegas",
      destinationState: "NV",
      miles: 332,
      rate: 830,
    },
    {
      laneNumber: "LN-1070",
      originCity: "Fresno",
      originState: "CA",
      destinationCity: "San Diego",
      destinationState: "CA",
      miles: 333,
      rate: 832.5,
    },
    {
      laneNumber: "LN-1068",
      originCity: "Sacramento",
      originState: "CA",
      destinationCity: "San Diego",
      destinationState: "CA",
      miles: 500,
      rate: 1250,
    },
    {
      laneNumber: "LN-1063",
      originCity: "San Diego",
      originState: "CA",
      destinationCity: "Phoenix",
      destinationState: "AZ",
      miles: 355,
      rate: 887.5,
    },
  ];

  window.PAK_TRANSPORTATION = {
    company: {
      name: "Business Name",
      shortName: "Business Name",
      phone: "(555) 014-2233",
      email: "dispatch@businessname.com",
      location: "Dallas, TX",
      hours: "Mon - Fri, 7:00 AM - 7:00 PM",
    },
    lanes: baseLanes.map((lane) => ({
      ...lane,
      pickup: pickupDate,
      delivery: deliveryDate,
    })),
  };
})();
