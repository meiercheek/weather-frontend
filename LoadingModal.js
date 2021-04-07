function Map() {
    <View style={styles.centeredView}>
     <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#00a6ff" />
            <Text style={styles.modalText}>Loading</Text>
          </View>
        </View>
      </Modal>
      </View>
}