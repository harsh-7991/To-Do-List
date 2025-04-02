
import random
import string

# Random String Generator
def random_string(length):
   l = length
   result = ''.join(random.choices(string.ascii_letters + string.digits, k=l))
   return str(result)