import { useDialogsList } from '@/features/messenger/model/useDialogsList'
import { DialogsRender } from '@/features/messenger/ui/DialogsRender'
import { SearchUsersRender } from '@/features/messenger/ui/SearchUsersRender'
import { ScrollArea } from '@byte-creators/ui-kit'
import { SearchComponent } from '@byte-creators/ui-kit/components'
import styles from './styles/dialogsList.module.css'
import { cn } from '@byte-creators/utils'

export const DialogsList = () => {
  const {
    cursor,
    data,
    filterSearchUsers,
    handleSetSearchValue,
    handleUserClick,
    isLoading,
    triggerSearchUsersRef,
  } = useDialogsList()

  return (
    <div className={styles.dialogsListContainer}>
      <div className={cn([styles.sidebar, 'border-dark-300 bg-dark-500'])}>
        <div className={styles.searchWrapper}>
          <SearchComponent fullWidth setValue={handleSetSearchValue} />
        </div>
        {data ? (
          <ScrollArea className={styles.scrollArea}>
            <ul>
              {data.items.map(dialog => (
                <DialogsRender
                  dialog={dialog}
                  handleUserClick={handleUserClick}
                  isLoading={isLoading}
                  key={dialog.id}
                />
              ))}
              {filterSearchUsers && filterSearchUsers.length !== 0 && (
                <>
                  <li className="text-center py-2">Global users</li>
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
