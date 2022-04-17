# marionette.infrastructure

This lib is a result of many years working on marionette front-end applications. There are always same things you should implement in every app. So i decided to gather most common things and publish as helper lib.

## Views

- **RawView** ✔  
*Its a almost clean Backbone View ready for use in marionette application.*

- **SimpleView** ✔  
*This view don't have UI elements and regions. Actually its just a view with template.*

- **HamburgerView** ✔  
*This view can render children in a hamburger style, child after child.*

- **ModelPropertyView** ✔   
*This view is bound to model property and reflects model's propery change*

- **ButtonView** ✔  
*Pretty complex button view with states and defined action behavior*

- **PromiseButtonsView** ✔  
*This view is for settling a promise, has optionaly from one to trhee buttons, f.e. used in confirm modal.*

## APIs

- modalsApi ✔
- backendApi ❌

## Objects

- BackendStore ❌
- EntryPage ❌

## Utils

- renderView ✔
- attachView ✔
- detachView ✔
- destroyView ✔
- buildView ✔

-----

Few words about emoji.  
Emoji are representing the state of a component: is it exist? documented? tested?  
And the order is as follow: exist emoji, documented emoji, tested emoji.  
for example:  
- Something ✔ - means `Something` exist but not documented and not tested.  
- Something ✔✔ - means `Something` exist and documented but not tested.  
- Something ✔❌✔ - means `Something` exist and tested but not documented.  
- Something ❌ - means `Something` is not yet exist but will in future.  
- Something 💯✔ - equals ✔✔✔ - exist, documented and tested.  
