# encoding: utf8
from django.http import *

def login_required_ajax(function=None, response_content=u'You have to log in first'):
	"""
	Decorator to replace Django's original login_required for AJAX calls.
	XMLHttpRequest objects process redirect reponses automatically and this may cause unwanted behaviour.
	"""
	def decorate(view_func):
		def handler(request, *args, **kwargs):
			if request.user.is_authenticated():
				return view_func(request, *args, **kwargs)
			return HttpResponseForbidden(response_content)
		return handler

	return decorate(function)