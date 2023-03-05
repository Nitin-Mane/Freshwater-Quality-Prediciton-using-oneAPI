
import numpy as np
from sklearn.preprocessing import StandardScaler 
from sklearn.decomposition import PCA
import xgboost as xgb

def apso_feature_selection(X, y, n_particles=50, max_iter=100, verbose=1):
    # Standardize the features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Reduce the dimensionality of the features using PCA
    pca = PCA(n_components=2)
    X = pca.fit_transform(X)

    # Define the fitness function to optimize
    def fitness_function(mask):
        # Select the features using the mask
        selected_features = X[:, mask]

        # Define the XGBoost classifier
        xgb_clf = xgb.XGBClassifier()

        # Fit the XGBoost classifier on the selected features
        xgb_clf.fit(selected_features, y)

        # Calculate the accuracy of the classifier
        accuracy = xgb_clf.score(selected_features, y)

        # Return the accuracy as the fitness score
        return accuracy

    # Initialize the particles with random positions
    positions = np.random.randint(2, size=(n_particles, X.shape[1]))

    # Initialize the particle velocities to zero
    velocities = np.zeros((n_particles, X.shape[1]))

    # Initialize the best positions and fitness scores
    best_positions = positions.copy()
    best_fitness = np.zeros(n_particles)

    # Evaluate the fitness of the initial positions
    for i in range(n_particles):
        best_fitness[i] = fitness_function(positions[i])

    # Initialize the global best position and fitness score
    global_best_position = best_positions[best_fitness.argmax()].copy()
    global_best_fitness = best_fitness.max()

    # Initialize the adaptive inertia weight and cognitive/ social learning factors
    w = 0.729
    c1 = 1.494
    c2 = 1.494
    alpha = 0.8
    beta = 1.2

    # Run the APSO algorithm for the specified number of iterations
    for t in range(max_iter):
        # Update the inertia weight
        w = beta - (beta - alpha) * (t / max_iter)

        # Update the particle velocities
        r1 = np.random.rand(n_particles, X.shape[1])
        r2 = np.random.rand(n_particles, X.shape[1])
        velocities = w * velocities + c1 * r1 * (best_positions - positions) + c2 * r2 * (global_best_position - positions)
        velocities = np.clip(velocities, -1, 1)

        # Update the particle positions
        positions += velocities
        positions = np.clip(positions, 0, 1)

        # Evaluate the fitness of the new positions
        for i in range(n_particles):
            fitness = fitness_function(positions[i])
            if fitness > best_fitness[i]:
                best_positions[i] = positions[i]
                best_fitness[i] = fitness

            if fitness > global_best_fitness:
                global_best_position = positions[i]
                global_best_fitness = fitness

        if verbose:
            print(f"Iteration {t+1}: Best fitness = {global_best_fitness}")

    # Get the selected features
    selected_features = np.array(range(X.shape[1]))[global_best_position.astype(bool)]

    return selected_features

