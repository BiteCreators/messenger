import { Provider } from 'react-redux'

import { store } from '@/application/store/store'
import Messenger from '@/features/messenger'

export default function MessengerWithStore() {
  return (
    <Provider store={store}>
      <Messenger />
    </Provider>
  )
}
