import {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
} from 'react';
import {reservations} from '../data/reservations';

export enum BasketActionType {
  ADDED = 'added',
  UPDATE = 'update',
}

type BasketUpdateAction = {
  type: BasketActionType.UPDATE;
  basketId: string;
  basketItem: any;
};

export type BasketAction = BasketUpdateAction;

const emptyBasket: any = {reservations: reservations};
const sessionKey = 'basketReservation';

export const BasketContext = createContext<any>(emptyBasket);

export const BasketDispatchContext =
  createContext<Dispatch<BasketAction> | null>(null);

const clearBasketSession = () => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem(sessionKey);
  }
  return emptyBasket;
};

const saveToBasketSession = (basket: any) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.setItem(sessionKey, JSON.stringify(basket));
  }
};

const getInitialBasket = () => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const storedBasket = sessionStorage.getItem(sessionKey);
    return storedBasket ? JSON.parse(storedBasket) : emptyBasket;
  }
  return emptyBasket;
};

export const useBasket = () => useContext(BasketContext);
export const useBasketDispatch = () => useContext(BasketDispatchContext);

const basketReducer = (basket: any, action: BasketAction): any => {
  let newBasket: any;
  switch (action.type) {
    case BasketActionType.UPDATE: {
      const reservations = basket.reservations.map(item => {
        if (item.basketId === action.basketId) {
          return {...item, ...action.basketItem};
        }
        return item;
      });

      newBasket = {
        ...basket,
        reservations,
      };

      break;
    }

    default:
      return basket;
  }

  saveToBasketSession(newBasket);

  return newBasket;
};

interface IBasketProvider {
  children: ReactElement;
}

export function BasketProvider({children}: IBasketProvider) {
  const [basket, dispatch] = useReducer(basketReducer, getInitialBasket());
  console.log('basketProvider', JSON.stringify(basket));
  return (
    <BasketContext.Provider value={basket}>
      <BasketDispatchContext.Provider value={dispatch}>
        {children}
      </BasketDispatchContext.Provider>
    </BasketContext.Provider>
  );
}
