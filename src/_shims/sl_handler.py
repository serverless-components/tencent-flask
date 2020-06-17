import app  # Replace with your actual application
import severless_wsgi

# If you need to send additional content types as text, add then directly
# to the whitelist:
#
# serverless_wsgi.TEXT_MIME_TYPES.append("application/custom+json")

def handler(event, context):
    return severless_wsgi.handle_request(app.app, event, context)