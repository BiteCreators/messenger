import { useDialogsList } from '@/features/messenger/model/useDialogsList'
import { DialogsRender } from '@/features/messenger/ui/DialogsRender'
import { SearchUsersRender } from '@/features/messenger/ui/SearchUsersRender'
import { ScrollArea } from '@byte-creators/ui-kit'
import { SearchComponent } from '@byte-creators/ui-kit/components'

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
    <div className={'flex'}>
      <div className={'border-dark-300 border bg-dark-500'} style={{ maxWidth: '270px' }}>
        <div className={'px-3 py-5'}>
          <SearchComponent fullWidth setValue={handleSetSearchValue} />
        </div>
        {data ? (
          <ScrollArea style={{ height: '570px' }}>
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
                  <li className={'text-center py-2'}>Global users</li>
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
          <p className={'text-center'}>No dialogs</p>
        )}
      </div>
    </div>
  )
}
