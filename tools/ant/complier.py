import os  

target_dir = '../../project/HTML5/'
target_file = 'TilesPuzzleHtml5-v1.0.js'

print 'Complier Start...' 

os.chdir(target_dir)
if os.path.isfile(target_file): 
	print 'delete old one'
	os.remove(target_file)
os.chdir(target_dir + 'src')
os.system('ant')
os.system('pause')

print 'Complier End...'