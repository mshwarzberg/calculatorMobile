import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  header: {
    backgroundColor: '#33333355',
    height: (1 / 11) * screenHeight,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
  input: {
    height: (1 / 11) * screenHeight,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'purple',
  },
  output: {
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'blue',
  },
  inOut: {
    alignSelf: 'center',
    position: 'absolute',
    right: 15,
    backgroundColor: 'green',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  symBoard: {
    display: 'flex',
    flexDirection: 'row',
    width: screenWidth,
    backgroundColor: 'yellow',
  },
  symColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  symButton: {
    width: (1 / 4) * screenWidth,
    height: 60,
    backgroundColor: 'yellow',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  numBoard: {
    display: 'flex',
    flexDirection: 'column',
  },
  numButton: {
    width: (1 / 3) * screenWidth,
    height: 110,
    backgroundColor: '#111185cc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 0.5,
  },
  buttonText: {
    fontSize: 35,
    color: 'white',
  },
  numRow: {
    display: 'flex',
    flexDirection: 'row',
  },
});
