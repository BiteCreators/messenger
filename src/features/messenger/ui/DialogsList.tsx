import { useDialogsList } from '@/features/messenger/model'
import { DialogsRender } from '@/features/messenger/ui/DialogsRender'
import { SearchUsersRender } from '@/features/messenger/ui/SearchUsersRender'
import { ScrollArea } from '@byte-creators/ui-kit'
import { SearchComponent } from '@byte-creators/ui-kit/components'

import styles from './styles/DialogsList.module.css'

export const DialogsList = () => {
  const {
    cursor,
    data,
    filterSearchUsers,
    handleSetSearchValue,
    handleUserClick,
    isLoading,
    currentUserId,
    triggerSearchUsersRef,
  } = useDialogsList()

  return (
    <div className={styles.dialogsListContainer}>
      <div className={styles.sidebar}>
        <div className={styles.searchWrapper}>
          <SearchComponent fullWidth setValue={handleSetSearchValue} />
        </div>
        {currentUserId && data ? (
          <ScrollArea className={styles.scrollArea}>
            <ul>
              {data.items.map(dialog => (
                <DialogsRender
                  dialog={dialog}
                  currentUserId={currentUserId}
                  handleUserClick={handleUserClick}
                  isLoading={isLoading}
                  key={dialog.id}
                />
              ))}
              {filterSearchUsers && filterSearchUsers.length !== 0 && (
                <>
                  <li className={styles.usersList}>Global users</li>
                  {filterSearchUsers.map((user, i) => (
                    <SearchUsersRender
                      handleUserClick={handleUserClick}
                      isLoading={isLoading}
                      key={user.id}
                      ref={
                        filterSearchUsers.length - 1 === i && cursor !== null
                          ? triggerSearchUsersRef
                          : null
                      }
                      user={user}
                    />
                  ))}
                </>
              )}
            </ul>
          </ScrollArea>
        ) : (
          <div className={styles.noDialogsWrapper}>
            <p className={styles.noDialogsMessage}>No dialogs</p>
          </div>
        )}
      </div>
    </div>
  )
}
