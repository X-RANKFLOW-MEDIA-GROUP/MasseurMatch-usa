export const neighbors: Record<string, string[]> = {
  // USA Cities
  miami: ["fort-lauderdale", "orlando", "tampa"],
  "fort-lauderdale": ["miami", "orlando", "tampa"],
  orlando: ["tampa", "miami", "jacksonville", "fort-lauderdale"],
  tampa: ["orlando", "miami", "fort-lauderdale", "jacksonville"],
  jacksonville: ["orlando", "tampa"],
  houston: ["dallas", "austin", "san-antonio"],
  dallas: ["houston", "austin", "san-antonio"],
  austin: ["houston", "dallas", "san-antonio"],
  "san-antonio": ["austin", "houston", "dallas"],
  "kansas-city": ["oklahoma-city", "wichita", "tulsa"],
  "oklahoma-city": ["tulsa", "kansas-city", "wichita"],
  tulsa: ["oklahoma-city", "wichita", "kansas-city"],
  wichita: ["kansas-city", "oklahoma-city", "tulsa"],

  // UK Cities
  london: ["brighton", "cambridge", "oxford"],
  manchester: ["liverpool", "leeds", "birmingham"],
  birmingham: ["manchester", "liverpool", "leeds", "bristol"],
  edinburgh: ["glasgow", "newcastle"],
  glasgow: ["edinburgh", "manchester", "liverpool"],
  bristol: ["birmingham", "brighton", "london"],
  liverpool: ["manchester", "leeds", "birmingham", "glasgow"],
  leeds: ["manchester", "liverpool", "birmingham", "newcastle"],
  newcastle: ["edinburgh", "leeds", "glasgow"],
  brighton: ["london", "bristol"],
};
