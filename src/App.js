import React, { useState, useEffect, useCallback } from "react";

import api from "./services/api";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post("repositories", {
      title: `Novo  repositorio ${Date.now()}`,
      url: "https:github.com",
      techs: ["nodejs", "react"],
    });

    const repositorie = response.data;
    setRepositories([repositorie, ...repositories]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const like = response.data;
    console.log(like);
    setRepositories(
      repositories.map((repository) =>
        repository.id === like.id ? (repository = like) : repository
      )
    );
  }

  const handleRemoveRepositorie = useCallback(
    (id) => {
      api.delete(`repositories/${id}`);
      setRepositories((repo) =>
        repo.filter((repository) => repository.id !== id)
      );
    },
    [setRepositories]
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={() => handleAddRepository()}
        >
          <Text style={styles.buttonTextAdd}>Adicionar</Text>
        </TouchableOpacity>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{item.title}</Text>

              <View style={styles.techsContainer}>
                {item.techs.map((tech) => (
                  <View key={tech}>
                    <Text style={styles.tech}>{tech}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${item.id}`}
                >
                  {item.likes && item.likes > 0
                    ? `${item.likes} ${
                        item.likes === 1 ? `curtida` : `curtidas`
                      }`
                    : ":( nenhuma curtida"}
                </Text>
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRemoveRepositorie(item.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonArea: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonLike: {
    maxWidth: 200,
  },
  buttonRemove: {
    maxWidth: 200,
  },
  button: {
    marginRight: 10,
    backgroundColor: "#7159c1",
    borderRadius: 6,
    padding: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonAdd: {
    padding: 10,
    marginBottom: 10,
  },
  buttonTextAdd: {
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#F00",
    padding: 10,
  },
});
