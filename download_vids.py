import os
import shutil

print('Preparing local video assets...')

if os.path.exists('ai1.mp4'):
    shutil.copy('ai1.mp4', 'ai1_new.mp4')
    print('Successfully prepared ai1_new.mp4')
else:
    print('Error: ai1.mp4 not found locally.')

if os.path.exists('ai2.mp4'):
    shutil.copy('ai2.mp4', 'ai2_new.mp4')
    print('Successfully prepared ai2_new.mp4')
else:
    print('Error: ai2.mp4 not found locally.')

print('Success')
