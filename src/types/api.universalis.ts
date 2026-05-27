export interface ApiPriceInfo {
  itemID: number,
  worldID: number,
  worldName: string,
  listings: ApiListInfo[],
  recentHistory: ApiHistoryInfo[],
  currentAveragePriceNQ: number,
  currentAveragePriceHQ: number,
  averagePriceNQ: number,
  averagePriceHQ: number,
  minPriceNQ: number,
  minPriceHQ: number,
  maxPriceNQ: number,
  maxPriceHQ: number
}
export interface ApiListInfo {
  // The time that this listing was posted, in seconds since the UNIX epoch.
  lastReviewTime: number; // int64
  // The price per unit sold.
  pricePerUnit: number; // int32
  // The stack size sold.
  quantity: number; // int32
  // The ID of the dye on this item.
  stainID: number; // int32
  // The world name, if applicable.
  worldName?: string;
  // The world ID, if applicable.
  worldID?: number; // int32
  // The creator's character name.
  creatorName?: string;
  // A SHA256 hash of the creator's ID.
  creatorID?: string;
  // Whether or not the item is high-quality.
  hq: boolean;
  // Whether or not the item is crafted.
  isCrafted: boolean;
  // The ID of this listing.
  listingID?: string;
  // The materia on this item.
  // materia?: Universalis.Application.Views.V1.MateriaView[];
  // Whether or not the item is being sold on a mannequin.
  onMannequin: boolean;
  // The city ID of the retainer. This is a game ID; all possible values can be seen at
  // https://xivapi.com/Town.
  //             
  // Limsa Lominsa = 1
  // Gridania = 2
  // Ul'dah = 3
  // Ishgard = 4
  // Kugane = 7
  // Crystarium = 10
  // Old Sharlayan = 12
  retainerCity: number; // int32
  // The retainer's ID.
  retainerID?: string;
  // The retainer's name.
  retainerName?: string;
  // A SHA256 hash of the seller's ID.
  sellerID?: string;
  // The total price.
  total: number; // int32
  // The Gil sales tax (GST) to be added to the total price during purchase.
  tax: number; // int32
}
export interface ApiHistoryInfo {
  // Whether or not the item was high-quality.
  hq: boolean;
  // The price per unit sold.
  pricePerUnit: number; // int32
  // The stack size sold.
  quantity: number; // int32
  // The sale time, in seconds since the UNIX epoch.
  timestamp: number; // int64
  // Whether or not this was purchased from a mannequin. This may be null.
  onMannequin?: boolean;
  // The world name, if applicable.
  worldName?: string;
  // The world ID, if applicable.
  worldID?: number; // int32
  // The buyer name.
  buyerName?: string;
  // The total price.
  total: number; // int32
}