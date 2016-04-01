# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
root = exports ? this
$ ->
	root.showLoading = () ->
		$('#spinner').show()
		return
	root.hideLoading = () ->
		$('#spinner').hide()
		return
	AppDispatcher = new Flux.Dispatcher();
	root.AppDispatcher = AppDispatcher
	root.SetStatus = (s) ->
		AppDispatcher.dispatch {action:'status',status:s}
		return
	sendRefresh = () ->
		AppDispatcher.dispatch {action:'refresh'}
		return
	root.debouncedSendRefresh = _.debounce sendRefresh, 1000
	return