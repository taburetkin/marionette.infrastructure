## Views
- **RawView** ✔  
*Its a almost clean Backbone View ready for use in marionette application.*
- **SimpleView** ✔  
*This view dont have UI elements and regions. Actually its just a view with template.*
- **HamburgerView** ✔  
*This view can render children in a hamberger style, child after child*
- **ModelPropertyView** ✔   
*This view is bound to model property and reflects model's propery change*
- **ButtonView** ✔  
*Pretty complex button view with states and defined action behavior*
- **PromiseButtonsView** ✔  
*This view is for settling a promise, has optionaly from one to trhee button, f.e. used in confirm modal.*

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
Few words about emoji  
They are representing the state of a component: is it exist? documented? tested?  
And the order is as follow: exist emoji, documented emoji, tested emoji.  
for example:  
- Something ✔ - means `Something` exist but not documented and not tested.  
- Something ✔❌✔ - means `Something` exist and tested but not documented.  
- Something ❌ - means `Something` is not yet exist but will in future.  
- Something 💯✔ - equals ✔✔✔ - exist, documented and tested.  
