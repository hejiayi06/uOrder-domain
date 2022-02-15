import { MenuSectionItem, MenuSectionModify } from 'src/app/share/types';

export type SectionValue = {
  id: number;
  store_id: number;
  name: string;
  min: number;
  max: number;
  repeats: number;
  sectionItems?: MenuSectionItem[];
  sectionModifiers?: MenuSectionModify[];
  updated_at: string;
  created_at: string;
  section_updated_at: string;
  section_created_at: string;
};
// export type SectionItem = {
//   id:number,
//   item_id:number,
//   section_id:number,
//   store_id:number,
//   price:string,
//   price_active:number,
//   quantity:number,
//   itemOrModify:boolean,
// }
// export type SectionModify = {
//   id:number,
//   item_id:number,
//   section_id:number,
//   store_id:number,
//   price:string,
//   price_active:number,
//   quantity:number,
//   itemOrModify:boolean,
// }
export type SectionOption = {
  id: number;
  item_id: number;
  section_id: number;
  store_id: number;
  price: string;
  price_active: number;
  quantity: number;
  itemOrModify: boolean;
  updated_at: string;
  created_at: string;
  min: number;
  max: number;
};
